import { TEXT_CONFIG, DURATION_FACTOR } from '..'
import { MoneyGroup } from '../gameObjects/MoneyGroup'
import { ProductGroup } from '../gameObjects/ProductGroup'
import Customer from '../gameObjects/Customer'
import Money, { VALUES } from '../gameObjects/Money'
import ClipboardModal from '../gameObjects/Clipboard'

const TIMER_MAX = 120
const PROGRESSION = [3, 7, 12, 18, 25, 33, 42, 52]
const LEVELS = [
  { minProducts: 1, maxProducts: 2, productIndexes: [0, 1] },
  { minProducts: 2, maxProducts: 3, productIndexes: [0, 1] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2, 3] },
  { minProducts: 3, maxProducts: 6, productIndexes: [0, 1, 2, 3, 4] },
  { minProducts: 3, maxProducts: 7, productIndexes: [1, 2, 3, 4, 5] },
  { minProducts: 3, maxProducts: 8, productIndexes: [2, 3, 4, 5, 6] },
  { minProducts: 4, maxProducts: 8, productIndexes: [3, 4, 5, 6, 7] },
  { minProducts: 4, maxProducts: 8, productIndexes: [4, 5, 6, 7, 8] },
]

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.moneyGroup = new MoneyGroup(this)
    this.productGroup = new ProductGroup(this)
    this.score = 0
    this.level = 0
    this.numCustomers = 0
    this.music = this.sound.add('gameMusic', { loop: true, volume: 0.35 })
    this.music.play()
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0)
    background.setDepth(-3)
    const table = this.add.image(0, 0, 'table')
    table.setOrigin(0)
    table.setDepth(-1)

    this.moneyGroup.createMoney()
    this.input.on('drag', (pointer, money, dragX, dragY) => {
      money.x = dragX
      money.y = dragY
    })

    const bar = this.add.image(10, 10, 'bar').setOrigin(0).setScale(1, 0.7)
    this.bar2 = this.add
      .image(10, 10, 'bar-2')
      .setOrigin(0)
      .setScale(1, 0.7)
      .setTint(0x88dd88)
    this.timerValue = TIMER_MAX
    this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        this.timerValue--
        this.roundTimer--
        if (this.timerValue <= -1) {
          this.music.stop()
          this.scene.start('Menu', { score: this.score })
          return
        }
        this.bar2.scaleX = this.timerValue / TIMER_MAX
      },
    })

    this.scoreText = this.add
      .text(this.width / 2, this.height - 120, 0, {
        ...TEXT_CONFIG,
        fontSize: 120,
        align: 'center',
      })
      .setShadow(2, 2, '#333333', 2, false, true)
      .setOrigin(0.5)

    this.add
      .image(this.width - 120, this.height * 0.94, 'submit')
      .setScale(1.8)
      .setInteractive()
      .on('pointerdown', this.onSubmit.bind(this))

    this.add
      .image(120, this.height * 0.94, 'submit')
      .setScale(1.8)
      .setFrame(1)
      .setInteractive()
      .on('pointerdown', this.onClipboard.bind(this))

    this.nextCustomer()
    this.clipboard = new ClipboardModal(this)
  }

  start() {}

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    this.moneyGroup.getChildren().forEach((c) => c.update())
    // this.totalText.text = this.moneyGroup.getPresented().value / 100
  }

  onSubmit() {
    const presented = this.moneyGroup.getPresented()
    const customerMoney = this.moneyGroup.getCustomer()

    // TODO: add sad sound for each customre and show sad frame for a few seconds when wrong
    // Add some particles and screenshake

    if (presented.value === customerMoney.value - this.targetValue) {
      // TODO: make score more interesting
      this.score += this.roundTimer
      this.scoreText.text = this.score

      this.timerValue += Math.min(Math.floor(this.roundTimer / 4), 10)
      this.timerValue = Math.min(TIMER_MAX, this.timerValue)
      this.bar2.scaleX = this.timerValue / TIMER_MAX

      this.customer.setFrame(this.customer.frameIndex + 1)

      // TODO: add nice sound for each customre and show happy frame for a few seconds
      // Add some particles and screenshake
      this.time.addEvent({
        delay: 500 * DURATION_FACTOR,
        callback: this.cleanup.bind(this),
      })
      this.tweens.add({
        targets: [this.customer],
        x: this.width + 600,
        duration: 700 * DURATION_FACTOR,
        delay: 500 * DURATION_FACTOR,
        ease: 'Power2',
        onComplete: this.nextCustomer.bind(this),
      })
    } else {
      this.timerValue -= 10
      this.customer.setFrame(this.customer.frameIndex + 2)
      this.cameras.main.shake(450, 0.01)
      this.time.addEvent({
        delay: 2500,
        callback: () => {
          this.customer.setFrame(this.customer.frameIndex)
        },
      })
      this.bar2.scaleX = this.timerValue / TIMER_MAX
    }
  }

  onClipboard() {
    this.tweens.add({
      targets: [this.clipboard],
      y: 200,
      duration: 400 * DURATION_FACTOR,
      delay: 100 * DURATION_FACTOR,
      ease: 'Power2',
      onComplete: () => {
        this.input.once('pointerdown', this.onClipboardUp.bind(this))
      },
    })
  }

  onClipboardUp() {
    this.tweens.add({
      targets: [this.clipboard],
      y: this.height,
      duration: 800 * DURATION_FACTOR,
      delay: 100 * DURATION_FACTOR,
      ease: 'Power2',
    })
  }

  cleanup() {
    const presented = this.moneyGroup.getPresented()
    const customerMoney = this.moneyGroup.getCustomer()
    customerMoney.sprites.forEach((s) => {
      s.makeDraggable()
      this.tweens.add({
        targets: [s],
        angle: Phaser.Math.RND.between(-30, 30),
        x: this.width / 2,
        y: this.height * 0.77,
        duration: 700 * DURATION_FACTOR,
        delay: 100 * DURATION_FACTOR,
        ease: 'Power2',
      })
    })
    presented.sprites.forEach((p) => p.destroy())
    const products = [...this.productGroup.getChildren()]
    products.forEach((p) => {
      p.destroy()
      p.value = 0
    })
  }

  nextCustomer() {
    const difficulty = LEVELS[this.level]
    this.productGroup.createProducts(
      Phaser.Math.RND.between(difficulty.minProducts, difficulty.maxProducts),
      difficulty.productIndexes,
    )
    this.createCustomer()
    this.presentCustomerMoney()
    this.numCustomers++
    if (this.numCustomers > PROGRESSION[this.level]) {
      this.level++
    }
    this.targetValue = this.productGroup.getTotalValue()
  }

  createCustomer() {
    this.customer && this.customer.destroy()
    this.customer = new Customer(this, 500, 400, Phaser.Math.RND.between(0, 3))
    this.add.existing(this.customer)
  }

  presentCustomerMoney() {
    let remaining = this.productGroup.getTotalValue()
    this.roundTimer = 200
    let i = 0
    while (remaining > 0) {
      i++
      const closestValue =
        [...VALUES].reverse().find((v) => v >= remaining) || 2000
      remaining -= closestValue
      const money = new Money(this, this.width - 250, 800, closestValue, {
        x: -200,
        y: 500,
        angle: 1,
        index: i,
        draggable: false,
        delay: 1500 * DURATION_FACTOR,
      })
      this.customer && money.value >= 100 && money.setTint(0x99aa99)
    }
  }
}
