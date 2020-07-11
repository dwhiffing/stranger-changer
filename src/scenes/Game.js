import { TEXT_CONFIG, DURATION_FACTOR } from '..'
import { MoneyGroup } from '../gameObjects/MoneyGroup'
import { ProductGroup } from '../gameObjects/ProductGroup'
import Customer from '../gameObjects/Customer'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.moneyGroup = new MoneyGroup(this)
    this.productGroup = new ProductGroup(this)
  }

  create() {
    const table = this.add.image(20, 1405, 'table')
    table.setScale(2.2, 1.5)
    // draw dividing line
    this.behavior = this.plugins.get('BehaviorPlugin')
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

    this.productGroup.createProducts()
    this.targetValue = this.productGroup.getTotalValue()
    let targetTextValue = ''
    // targetTextValue = (this.targetValue / 100).toFixed(2)

    this.createCustomer()

    this.targetText = this.add
      .text(0, 20, targetTextValue, TEXT_CONFIG)
      .setShadow(2, 2, '#333333', 2, false, true)

    this.totalText = this.add
      .text(this.width - 200, 20, 0, TEXT_CONFIG)
      .setShadow(2, 2, '#333333', 2, false, true)

    this.add
      .image(this.width - 100, this.height * 0.6, 'submit')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        const presented = this.moneyGroup.getPresented()
        const customerMoney = this.moneyGroup.getCustomer()
        if (presented.value === customerMoney.value - this.targetValue) {
          presented.sprites.forEach((p) => p.destroy())
          this.productGroup.createProducts()
          this.targetValue = this.productGroup.getTotalValue()
          this.tweens.add({
            targets: [this.customer],
            x: this.width + 500,
            duration: 700 * DURATION_FACTOR,
            ease: 'Power2',
            onComplete: () => {
              this.createCustomer()
            },
          })
          customerMoney.sprites.forEach((s) => {
            s.makeDraggable()
            this.tweens.add({
              targets: [s],
              angle: Phaser.Math.RND.between(-30, 30),
              x: this.width / 2,
              y: this.height * 0.77,
              duration: 700 * DURATION_FACTOR,
              ease: 'Power2',
            })
          })
        }
      })
  }

  start() {}

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    this.totalText.text = this.moneyGroup.getPresented().value / 100
  }

  createCustomer() {
    this.customer && this.customer.destroy()
    this.customer = new Customer(this, 500, 500)
    this.add.existing(this.customer)
  }
}
