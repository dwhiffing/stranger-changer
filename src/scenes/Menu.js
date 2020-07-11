import { TEXT_CONFIG } from '..'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    if (opts.score) {
      this.scoreText = this.add
        .text(this.width / 2, this.height / 2, opts.score, TEXT_CONFIG)
        .setShadow(2, 2, '#333333', 2, false, true)
    }
  }

  create() {
    this.add
      .image(this.width / 2, this.height / 1.2, 'playButton')
      .setScale(1)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game')
      })
  }
}
