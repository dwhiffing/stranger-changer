import Money from '../sprites/Money'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
  }

  create() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const money = new Money(
          this,
          143 + 265 * i,
          143 + 525 * j,
          Phaser.Math.RND.pick([2000, 1000, 500, 100, 25, 10, 5, 1]),
        )
      }
    }

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX
      gameObject.y = dragY
    })
  }

  start() {}

  update() {}
}
