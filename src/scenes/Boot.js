export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()

    this.load.on('progress', (value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 1)
      progress.fillRect(
        0,
        this.sys.game.config.height / 2,
        this.sys.game.config.width * value,
        60,
      )
    })

    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
    )

    this.load.audio('bounce', 'assets/audio/bounce.mp3')
    this.load.image('playButton', 'assets/images/button.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.spritesheet('submit', 'assets/images/submit.png', {
      frameWidth: 100,
      frameHeight: 100,
    })
    this.load.image('table', 'assets/images/table.png')
    this.load.image('bar', 'assets/images/bar.png')
    this.load.image('bar-2', 'assets/images/bar-2.png')
    this.load.image('background', 'assets/images/background.png')
    this.load.image('clipboard', 'assets/images/clipboard.png')
    this.load.spritesheet('customer', 'assets/images/customers.png', {
      frameWidth: 512,
      frameHeight: 512,
    })
    this.load.spritesheet('product', 'assets/images/product.png', {
      frameWidth: 256,
      frameHeight: 256,
    })
    this.load.spritesheet('cash', 'assets/images/cash.png', {
      frameWidth: 256,
      frameHeight: 512,
    })
    this.load.spritesheet('change', 'assets/images/change.png', {
      frameWidth: 128,
      frameHeight: 128,
    })

    this.load.on('complete', () => {
      WebFont.load({
        custom: {
          families: ['AnotherHand'],
        },
        active: () => {
          progress.destroy()
          this.scene.start('Menu')
        },
      })
    })
  }
}
