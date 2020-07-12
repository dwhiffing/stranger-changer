import { TEXT_CONFIG } from '..'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' })
  }

  init(opts) {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    const background = this.add.image(0, 0, 'background')
    background.setOrigin(0)
    background.setDepth(-3)
    const table = this.add.image(0, 0, 'table')
    table.setOrigin(0)
    table.setDepth(-1)
    const title = this.add.image(0, 0, 'title')
    title.setOrigin(0)
    title.setDepth(-1)
    if (opts.score) {
      this.scoreText = this.add
        .text(this.width / 2, this.height / 2, opts.score, {
          ...TEXT_CONFIG,
          fontSize: 120,
        })
        .setShadow(2, 2, '#333333', 2, false, true)
        .setOrigin(0.5)
    }
  }

  create() {
    this.add
      .image(this.width / 2, this.height / 1.2, 'playButton')
      .setScale(1.8)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start('Game')
      })
  }
}
