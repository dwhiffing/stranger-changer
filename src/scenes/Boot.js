export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload() {
    const progress = this.add.graphics()

    window.isMuted = !!Number(localStorage.getItem('mute'))
    this.sound.mute = window.isMuted

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

    this.load.audio('manAngry1Voice', 'assets/audio/voices/man-angry1.mp3')
    this.load.audio('manAngry2Voice', 'assets/audio/voices/man-angry2.mp3')
    this.load.audio('manHappy1Voice', 'assets/audio/voices/man-happy1.mp3')
    this.load.audio('manHappy2Voice', 'assets/audio/voices/man-happy2.mp3')
    this.load.audio('manNeutral1Voice', 'assets/audio/voices/man-neutral1.mp3')
    this.load.audio('manNeutral2Voice', 'assets/audio/voices/man-neutral2.mp3')
    this.load.audio('womanAngry1Voice', 'assets/audio/voices/woman-angry1.mp3')
    this.load.audio('womanAngry2Voice', 'assets/audio/voices/woman-angry2.mp3')
    this.load.audio('womanHappy1Voice', 'assets/audio/voices/woman-happy1.mp3')
    this.load.audio('womanHappy2Voice', 'assets/audio/voices/woman-happy2.mp3')
    this.load.audio(
      'womanNeutral1Voice',
      'assets/audio/voices/woman-neutral1.mp3',
    )
    this.load.audio(
      'womanNeutral2Voice',
      'assets/audio/voices/woman-neutral2.mp3',
    )

    this.load.audio('menuMusic', 'assets/audio/grocer-menu-music.mp3')
    this.load.audio('gameMusic', 'assets/audio/grocer-game-music.mp3')
    this.load.audio('buzzerSound', 'assets/audio/buzzer.mp3')
    this.load.audio('woosh1Sound', 'assets/audio/woosh1.mp3')
    this.load.audio('woosh2Sound', 'assets/audio/woosh2.mp3')
    this.load.audio('registerSound', 'assets/audio/register.mp3')
    this.load.audio('coin1Sound', 'assets/audio/coin2.mp3')
    this.load.audio('coin2Sound', 'assets/audio/coin2.mp3')
    this.load.audio('productDrop1Sound', 'assets/audio/productDrop.mp3')
    this.load.audio('productDrop2Sound', 'assets/audio/productDrop2.mp3')
    this.load.audio('productDrop3Sound', 'assets/audio/productDrop3.mp3')
    this.load.audio('coinBreakdownSound', 'assets/audio/coin-breakdown.mp3')
    this.load.audio('cash1Sound', 'assets/audio/cash1.mp3')
    this.load.audio('cash2Sound', 'assets/audio/cash2.mp3')
    this.load.audio('whoopsSound', 'assets/audio/whoops.mp3')
    this.load.audio('successSound', 'assets/audio/success.mp3')
    this.load.audio('cashBreakdownSound', 'assets/audio/cash-breakdown.mp3')
    this.load.image('playButton', 'assets/images/button.png')
    this.load.image('title', 'assets/images/title.png')
    this.load.spritesheet('icon', 'assets/images/icons.png', {
      frameWidth: 100,
      frameHeight: 100,
    })
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
