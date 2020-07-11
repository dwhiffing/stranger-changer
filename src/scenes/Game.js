import Money from '../sprites/Money'

const TEXT_CONFIG = {
  fontFamily: 'Space Mono',
  fontSize: 100,
  align: 'center',
  color: '#ffffff',
}

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.moneyGroup = new MoneyGroup(this)
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

    // create random target value
    this.targetValue = Math.floor(Math.random() * 1000)

    // create starting money
    for (let i = 0; i < 4; i++) {
      new Money(
        this,
        143 + 265 * i,
        this.height - 300,
        Phaser.Math.RND.pick([2000, 1000, 500]),
      )
    }

    // add money dragging
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })

    this.targetText = this.add
      .text(0, 20, (this.targetValue / 100).toFixed(2), TEXT_CONFIG)
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

    // if value is equal, clear money
    if (valuePresented === this.targetValue) {
      this.targetValue = Math.floor(Math.random() * 1000)
      this.targetText.text = (this.targetValue / 100).toFixed(2)
      presentedMoney.forEach((p) => p.destroy())
    }
  }
}

class MoneyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
  }
}
