import { TEXT_CONFIG, DURATION_FACTOR } from '..'
import ClipboardModal from '../gameObjects/Clipboard'
import Customer from '../gameObjects/Customer'

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

    if (!opts.score) {
      const title = this.add.image(0, 650, 'title')
      title.setOrigin(0)
      title.setDepth(-1)
    }

    if (opts.score) {
      this.scoreText = this.add
        .text(this.width / 2, this.height * 0.45, `Score:  ${opts.score}`, {
          ...TEXT_CONFIG,
          fontSize: 150,
        })
        .setShadow(2, 2, '#333333', 2, false, true)
        .setOrigin(0.5)
      this.rankText = this.add
        .text(
          this.width / 2,
          this.height * 0.55,
          `Rank:  ${getRank(opts.score)}`,
          {
            ...TEXT_CONFIG,
            fontSize: 150,
          },
        )
        .setShadow(2, 2, '#333333', 2, false, true)
        .setOrigin(0.5)
    }
    this.music = this.sound.add('menuMusic', { loop: true, volume: 0.35 })
    this.registerSound = this.sound.add('registerSound', {
      volume: 0.5,
    })
    this.woosh1Sound = this.sound.add('woosh1Sound', { volume: 0.5 })
    this.woosh2Sound = this.sound.add('woosh2Sound', { volume: 0.5 })
    this.music.play()

    this.mute = this.add.image(this.width - 130, this.height - 130, 'icon')
    this.mute.setOrigin(0)
    this.mute.setFrame(window.isMuted ? 2 : 1)
    this.mute.setInteractive().on('pointerdown', () => {
      window.isMuted = !window.isMuted
      this.sound.mute = window.isMuted
      localStorage.setItem('mute', window.isMuted ? 1 : 0)
      this.mute.setFrame(window.isMuted ? 2 : 1)
    })
  }

  scrollCustomer() {
    this.customer && this.customer.destroy()
    this.customer = new Customer(this, -500, 400, Phaser.Math.RND.between(0, 3))
    this.add.existing(this.customer)

    this.tweens.add({
      targets: [this.customer],
      x: this.width * 2,
      duration: Phaser.Math.RND.between(4000, 7000),
      delay: Phaser.Math.RND.between(500, 3000),
      onComplete: this.scrollCustomer.bind(this),
    })

    this.tweens.add({
      targets: [this.customer],
      y: this.customer.y + 20,
      duration: 500,
      yoyo: true,
      repeat: -1,
    })
  }

  create() {
    this.scrollCustomer()
    this.add
      .image(120, this.height * 0.94, 'submit')
      .setScale(1.8)
      .setFrame(1)
      .setInteractive()
      .on('pointerdown', this.onClipboard.bind(this))

    this.clipboard = new ClipboardModal(this)
    const button = this.add
      .image(this.width / 2, this.height / 1.25, 'playButton')
      .setScale(1.3)
      .setInteractive()
      .on('pointerdown', () => {
        this.registerSound.play()
        this.music.stop()
        this.scene.start('Game')
      })
    button.angle = -10
    this.tweens.add({
      targets: [button],
      angle: 10,
      ease: 'Power2',
      yoyo: true,
      repeat: -1,
      duration: 300,
    })
  }

  onClipboard() {
    if (this.clipboardIsUp) {
      return
    }
    this.clipboardIsUp = true
    this.woosh1Sound.play()
    this.tweens.add({
      targets: [this.clipboard],
      y: 200,
      duration: 400 * DURATION_FACTOR,
      delay: 100 * DURATION_FACTOR,
      ease: 'Power2',
      onComplete: () => {
        this.input.once('pointerdown', this.onClipboardUp.bind(this))
      },
    })
  }

  onClipboardUp() {
    this.woosh2Sound.play()
    this.clipboardIsUp = false
    this.tweens.add({
      targets: [this.clipboard],
      y: this.height,
      duration: 800 * DURATION_FACTOR,
      delay: 100 * DURATION_FACTOR,
      ease: 'Power2',
    })
  }
}

const getRank = (score) => {
  if (score < 1000) {
    return 'Trainee'
  }
  if (score < 5000) {
    return 'Clerk'
  }
  if (score < 10000) {
    return 'Assistant Manager'
  }
  if (score < 20000) {
    return 'Manager'
  }
  if (score < 40000) {
    return 'Regional Manager'
  }

  return 'CEO'
}
