import { TEXT_CONFIG } from '..'
import { MoneyGroup } from '../gameObjects/MoneyGroup'
import { ProductGroup } from '../gameObjects/ProductGroup'

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
    // draw dividing line
    this.behavior = this.plugins.get('BehaviorPlugin')
    var graphics = this.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1)
    graphics.strokeLineShape(
      new Phaser.Geom.Line(0, this.height / 3, this.width, this.height / 3),
    )
    graphics.strokeLineShape(
      new Phaser.Geom.Line(
        0,
        (this.height / 3) * 2,
        this.width,
        (this.height / 3) * 2,
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

    this.targetText = this.add
      .text(0, 20, targetTextValue, TEXT_CONFIG)
      .setShadow(2, 2, '#333333', 2, false, true)

    this.totalText = this.add
      .text(this.width - 200, 20, 0, TEXT_CONFIG)
      .setShadow(2, 2, '#333333', 2, false, true)

    this.add
      .image(this.width / 2, this.height - 100, 'submit')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        const presented = this.moneyGroup.getPresented()
        const customer = this.moneyGroup.getCustomer()
        if (presented.value === customer.value - this.targetValue) {
          presented.sprites.forEach((p) => p.destroy())
          this.productGroup.createProducts()
          this.targetValue = this.productGroup.getTotalValue()
          customer.sprites.forEach((s) => {
            s.makeDraggable()
            this.tweens.add({
              targets: [s],
              y: this.height * 0.66,
              duration: 500,
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
}
