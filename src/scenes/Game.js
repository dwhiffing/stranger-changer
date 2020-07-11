import Money, { VALUES } from '../sprites/Money'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.monies = this.add.group()
  }

  create() {
    this.targetValue = Math.floor(Math.random() * 1000)
    for (let i = 0; i < 4; i++) {
      new Money(
        this,
        143 + 265 * i,
        this.height - 300,
        Phaser.Math.RND.pick([2000, 1000, 500]),
      )
    }

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })

    this.targetText = this.add
      .text(0, 20, (this.targetValue / 100).toFixed(2), {
        fontFamily: 'Space Mono',
        fontSize: 100,
        align: 'center',
        color: '#ffffff',
      })
      .setShadow(2, 2, '#333333', 2, false, true)

    this.totalText = this.add
      .text(this.width - 200, 20, 0, {
        fontFamily: 'Space Mono',
        fontSize: 100,
        align: 'center',
        color: '#ffffff',
      })
      .setShadow(2, 2, '#333333', 2, false, true)
  }

  start() {}

  update() {
    const presentedMoney = this.monies.getChildren().filter((t) => t.y < 500)
    const valuePresented = presentedMoney.reduce((sum, t) => sum + t.value, 0)
    this.totalText.text = valuePresented / 100
    if (valuePresented === this.targetValue) {
      this.targetValue = Math.floor(Math.random() * 1000)
      this.targetText.text = (this.targetValue / 100).toFixed(2)
      presentedMoney.forEach((p) => p.destroy())
    }
  }
}
