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
  { minProducts: 2, maxProducts: 4, productIndexes: [0, 1] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2, 3] },
  { minProducts: 3, maxProducts: 6, productIndexes: [0, 1, 2, 3, 4] },
  { minProducts: 3, maxProducts: 7, productIndexes: [1, 2, 3, 4, 5] },
  { minProducts: 3, maxProducts: 8, productIndexes: [2, 3, 4, 5, 6] },
  { minProducts: 4, maxProducts: 8, productIndexes: [3, 4, 5, 6, 7] },
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
    this.registerSound = this.sound.add('registerSound', {
      volume: 0.5,
    })
    this.manAngry1Voice = this.sound.add('manAngry1Voice')
    this.manAngry2Voice = this.sound.add('manAngry2Voice')
    this.manHappy1Voice = this.sound.add('manHappy1Voice')
    this.manHappy2Voice = this.sound.add('manHappy2Voice')
    this.manNeutral1Voice = this.sound.add('manNeutral1Voice')
    this.manNeutral2Voice = this.sound.add('manNeutral2Voice')
    this.womanAngry1Voice = this.sound.add('womanAngry1Voice')
    this.womanAngry2Voice = this.sound.add('womanAngry2Voice')
    this.womanHappy1Voice = this.sound.add('womanHappy1Voice')
    this.womanHappy2Voice = this.sound.add('womanHappy2Voice')
    this.womanNeutral1Voice = this.sound.add('womanNeutral1Voice')
    this.womanNeutral2Voice = this.sound.add('womanNeutral2Voice')
    this.buzzerSound = this.sound.add('buzzerSound', { volume: 1 })
    this.whoopsSound = this.sound.add('whoopsSound', { volume: 1 })
    this.successSound = this.sound.add('successSound', { volume: 1 })
    this.cash1Sound = this.sound.add('cash1Sound', { volume: 0.3 })
    this.cash2Sound = this.sound.add('cash2Sound', { volume: 0.4 })
    this.cashBreakdownSound = this.sound.add('cashBreakdownSound', {
      volume: 0.5,
    })
    this.coin1Sound = this.sound.add('coin1Sound', { volume: 0.2 })
    this.coin2Sound = this.sound.add('coin2Sound', { volume: 0.5 })
    this.coinBreakdownSound = this.sound.add('coinBreakdownSound', {
      volume: 0.5,
    })
    this.woosh1Sound = this.sound.add('woosh1Sound', { volume: 0.5 })
    this.woosh2Sound = this.sound.add('woosh2Sound', { volume: 0.5 })
    this.productDrop1Sound = this.sound.add('productDrop1Sound', {
      volume: 0.3,
    })
    this.productDrop2Sound = this.sound.add('productDrop2Sound', {
      volume: 0.3,
    })
    this.productDrop3Sound = this.sound.add('productDrop3Sound', {
      volume: 0.3,
    })
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
    this.input.on('pointerup', (pointer, money, dragX, dragY) => {
      this.moneyGroup.getChildren().forEach((c) => c.onDrop(false))
    })

    this.mute = this.add.image(40, 160, 'icon')
    this.mute.setOrigin(0)
    this.mute.setFrame(window.isMuted ? 2 : 1)
    this.mute.setInteractive().on('pointerdown', () => {
      window.isMuted = !window.isMuted
      this.sound.mute = window.isMuted
      localStorage.setItem('mute', window.isMuted ? 1 : 0)
      this.mute.setFrame(window.isMuted ? 2 : 1)
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
        this.roundTimer > 1 && this.roundTimer--
        console.log({ roundTimer: this.roundTimer })
        if (this.timerValue <= -1) {
          this.music.stop()
          this.buzzerSound.play()
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

    this.submitButton = this.add
      .image(this.width - 120, this.height * 0.94, 'submit')
      .setScale(1.8)
      .setDepth(5)
      .setInteractive()
      .on('pointerdown', this.onSubmit.bind(this))

    this.add
      .image(120, this.height * 0.94, 'submit')
      .setScale(1.8)
      .setFrame(1)
      .setDepth(5)
      .setInteractive()
      .on('pointerdown', this.onClipboard.bind(this))

    this.newScoreText = this.add.text(0, 0, '', {
      ...TEXT_CONFIG,
      fontSize: 300,
    })

    this.nextCustomer()
    this.clipboard = new ClipboardModal(this)
  }

  start() {}

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    this.moneyGroup.getChildren().forEach((c) => c.update())
    // this.totalText.text = this.moneyGroup.getPresented().value / 100

    if (this.newScoreText.active) {
      this.newScoreText.y -= 1
      this.newScoreText.alpha -= 0.01
      if (this.newScoreText.alpha <= 0) this.newScoreText.setActive(false)
    }
  }

  onSubmit() {
    if (!this.canSubmit) {
      return
    }
    const presented = this.moneyGroup.getPresented()
    const customerMoney = this.moneyGroup.getCustomer()
    this.canSubmit = false
    this.submitButton.alpha = 0.5
    // TODO: add sad sound for each customre and show sad frame for a few seconds when wrong
    // Add some particles and screenshake

    if (presented.value === customerMoney.value - this.targetValue) {
      // TODO: make score more interesting
      this.registerSound.play()
      const levelModifier = (this.level + 1) / 2
      const baseScore = Math.min(this.roundTimer, 30) * 10
      const newScore = baseScore * levelModifier
      console.log(this.roundTimer, baseScore, levelModifier, newScore)
      this.score += newScore
      this.scoreText.text = this.score

      this.newScoreText
        .setPosition(this.width / 2, this.height / 2)
        .setActive(true)
        .setAlpha(1)
        .setText(`+${newScore}`)
        .setDepth(5)
        .setOrigin(0.5)

      this.timerValue += Math.floor(this.roundTimer)
      this.timerValue = Math.min(TIMER_MAX, this.timerValue)
      this.bar2.scaleX = this.timerValue / TIMER_MAX
      this.successSound.play()

      this.customer.setFrame(this.customer.frameIndex + 1)
      this.customer.vocalize('happy')

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
      this.timerValue -= 2
      this.customer.vocalize('sad')
      this.whoopsSound.play()
      this.customer.setFrame(this.customer.frameIndex + 2)
      this.cameras.main.shake(450, 0.01)
      this.time.addEvent({
        delay: 2500,
        callback: () => {
          this.customer.setFrame(this.customer.frameIndex)
          this.canSubmit = true
          this.submitButton.alpha = 1
        },
      })
      this.bar2.scaleX = this.timerValue / TIMER_MAX
    }
  }

  onClipboard() {
    if (this.clipboardIsUp) {
      return
    }
    this.clipboardIsUp = true
    this.woosh1Sound.play()
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
    this.woosh2Sound.play()
    this.clipboardIsUp = false
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
        angle: Phaser.Math.RND.between(-90, 90),
        x: Phaser.Math.RND.between(50, this.width - 50),
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
    console.log({ target: this.targetValue })
  }

  createCustomer() {
    this.customer && this.customer.destroy()
    this.customer = new Customer(this, 500, 400, Phaser.Math.RND.between(0, 3))
    this.customer.vocalize('neutral')

    this.add.existing(this.customer)
  }

  presentCustomerMoney() {
    let remaining = this.productGroup.getTotalValue()
    this.roundTimer = 35 + 5 * this.level
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
        onComplete: () => {
          this.canSubmit = true
          this.submitButton.alpha = 1
        },
        delay: 1000 * DURATION_FACTOR,
      })
      this.customer && money.value >= 100 && money.setTint(0x99aa99)
    }
  }
}
