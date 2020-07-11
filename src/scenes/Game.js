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
    var graphics = this.add.graphics()
    graphics.lineStyle(4, 0xffffff, 1)
    graphics.strokeLineShape(
      new Phaser.Geom.Line(
        0,
        this.height / 2 - 150,
        this.width,
        this.height / 2 - 150,
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
  }

  start() {}

  update() {
    const presentedMoney = this.moneyGroup
      .getChildren()
      .filter((t) => t.y < this.height / 2)
    const valuePresented = presentedMoney.reduce((sum, t) => sum + t.value, 0)
    this.totalText.text = valuePresented / 100

    // if value is equal, clear money and get new products
    if (valuePresented === this.targetValue) {
      presentedMoney.forEach((p) => p.destroy())
      this.productGroup.createProducts()
      this.targetValue = this.productGroup.getTotalValue()
      // this.targetText.text = (this.targetValue / 100).toFixed(2)
    }
  }
}
