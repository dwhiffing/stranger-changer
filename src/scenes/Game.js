import Money, { VALUES } from '../sprites/Money'

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
        new Money(
          this,
          143 + 265 * i,
          143 + 525 * j,
          Phaser.Math.RND.pick(VALUES),
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
