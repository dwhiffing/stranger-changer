import { TEXT_CONFIG, DURATION_FACTOR } from '..'
import { MoneyGroup } from '../gameObjects/MoneyGroup'
import { ProductGroup } from '../gameObjects/ProductGroup'
import Customer from '../gameObjects/Customer'
import Money, { VALUES } from '../gameObjects/Money'

const LEVELS = [
  { minProducts: 1, maxProducts: 2, productIndexes: [0, 1] },
  { minProducts: 1, maxProducts: 3, productIndexes: [0, 1, 2] },
  { minProducts: 2, maxProducts: 5, productIndexes: [0, 1, 2, 3] },
  { minProducts: 2, maxProducts: 5, productIndexes: [0, 1, 2, 3, 4] },
  { minProducts: 3, maxProducts: 6, productIndexes: [0, 1, 2, 3, 4] },
  { minProducts: 3, maxProducts: 7, productIndexes: [1, 2, 3, 4, 5] },
  { minProducts: 4, maxProducts: 8, productIndexes: [2, 3, 4, 5, 6] },
  { minProducts: 4, maxProducts: 8, productIndexes: [3, 4, 5, 6, 7] },
  { minProducts: 5, maxProducts: 8, productIndexes: [4, 5, 6, 7, 8] },
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
    this.level = 7
  }

  create() {
    this.behavior = this.plugins.get('BehaviorPlugin')

    const table = this.add.image(20, 1405, 'table')
    table.setScale(2.2, 1.5)

    var graphics = this.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1)
    graphics.strokeLineShape(
      new Phaser.Geom.Line(
        0,
        this.height * 0.65,
        this.width,
        this.height * 0.65,
      ),
    )

    this.moneyGroup.createMoney()
    this.input.on('drag', (pointer, money, dragX, dragY) => {
      money.x = dragX
      money.y = dragY
    })

    this.timerValue = 60
    this.timeText = this.add
      .text(20, 20, this.timerValue, TEXT_CONFIG)
      .setShadow(2, 2, '#333333', 2, false, true)

    this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        this.timerValue--
        if (this.timerValue === -1) {
          this.scene.start('Menu', { score: this.score })
          return
        }
        this.timeText.text = this.timerValue
      },
    })

    this.scoreText = this.add
      .text(this.width - 200, 20, 0, TEXT_CONFIG)
      .setShadow(2, 2, '#333333', 2, false, true)

    this.add
      .image(this.width - 100, this.height * 0.6, 'submit')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', this.onSubmit.bind(this))

    this.nextCustomer()
  }

  start() {}

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    // this.totalText.text = this.moneyGroup.getPresented().value / 100
  }

  onSubmit() {
    const presented = this.moneyGroup.getPresented()
    const customerMoney = this.moneyGroup.getCustomer()

    if (presented.value === customerMoney.value - this.targetValue) {
      // TODO: make score more interesting
      this.score += 10
      this.scoreText.text = this.score

      this.cleanup()

      this.tweens.add({
        targets: [this.customer],
        x: this.width + 600,
        duration: 700 * DURATION_FACTOR,
        ease: 'Power2',
        onComplete: this.nextCustomer.bind(this),
      })
    }
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
        delay: 200 * DURATION_FACTOR,
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
    this.targetValue = this.productGroup.getTotalValue()
  }

  createCustomer() {
    this.customer && this.customer.destroy()
    this.customer = new Customer(this, 500, 500, Phaser.Math.RND.between(0, 3))
    this.add.existing(this.customer)
  }

  presentCustomerMoney() {
    const total = this.productGroup.getTotalValue()
    // TODO: need to handle needing more than 1 bill to cash out
    const money = new Money(
      this,
      this.width - 200,
      770,
      [...VALUES].reverse().find((v) => v >= total),
      {
        x: -200,
        y: 500,
        angle: 5,
        draggable: false,
        delay: 1500 * DURATION_FACTOR,
      },
    )
    this.customer && money.setTint(moneyTints[this.customer.frameIndex])
  }
}

const moneyTints = [0xff0000, 0xffff00, 0x0000ff, 0x00ff00]
