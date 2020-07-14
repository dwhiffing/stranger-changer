import ClipboardModal from './Clipboard'
import { TEXT_CONFIG } from '..'

const TIMER_MAX = 120

export class UiGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.scene = scene
    this.woosh1Sound = this.scene.sound.add('woosh1Sound', {
      volume: 0.5,
    })
    this.woosh2Sound = this.scene.sound.add('woosh2Sound', {
      volume: 0.5,
    })
    this.scene.add.image(0, 0, 'background').setOrigin(0).setDepth(-3)
    this.scene.add.image(0, 0, 'table').setOrigin(0).setDepth(-1)
    this.scene.mute = this.scene.add
      .image(40, 160, 'icon')
      .setOrigin(0)
      .setFrame(window.isMuted ? 2 : 1)
      .setInteractive()
      .on('pointerdown', () => {
        window.isMuted = !window.isMuted
        this.scene.sound.mute = window.isMuted
        localStorage.setItem('mute', window.isMuted ? 1 : 0)
        this.scene.mute.setFrame(window.isMuted ? 2 : 1)
      })

    this.scene.add.image(10, 10, 'bar').setOrigin(0).setScale(1, 0.7)
    this.scene.innerBar = this.scene.add
      .image(10, 10, 'bar-2')
      .setOrigin(0)
      .setScale(1, 0.7)
      .setTint(0x88dd88)

    this.scene.scoreText = this.scene.add
      .text(this.scene.width / 2, this.scene.height - 135, 0, {
        ...TEXT_CONFIG,
        fontSize: 120,
        align: 'center',
      })
      .setShadow(2, 2, '#333333', 2, false, true)
      .setOrigin(0.5)

    this.scene.submitButton = this.scene.add
      .image(this.scene.width - 120, this.scene.height * 0.92, 'submit')
      .setScale(1.8)
      .setDepth(5)
      .setInteractive()
      .on('pointerdown', this.scene.onSubmit.bind(this.scene))

    this.scene.add
      .image(120, this.scene.height * 0.92, 'submit')
      .setScale(1.8)
      .setFrame(1)
      .setDepth(5)
      .setInteractive()
      .on('pointerdown', this.onClipboard.bind(this))

    this.clipboard = new ClipboardModal(this.scene)

    this.scene.newScoreText = this.scene.add.text(0, 0, '', {
      ...TEXT_CONFIG,
      fontSize: 300,
    })

    this.scene.timerValue = TIMER_MAX
    this.scene.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: this.onUpdateTimer.bind(this),
    })
  }

  onClipboard() {
    if (this.clipboardIsUp) {
      return
    }
    this.clipboardIsUp = true
    this.woosh1Sound.play()
    this.scene.tweens.add({
      targets: [this.clipboard],
      y: 200,
      duration: 400,
      delay: 100,
      ease: 'Power2',
      onComplete: () => {
        this.scene.input.once('pointerdown', this.onClipboardUp.bind(this))
      },
    })
  }

  onClipboardUp() {
    this.woosh2Sound.play()
    this.clipboardIsUp = false
    this.scene.tweens.add({
      targets: [this.clipboard],
      y: this.scene.height,
      duration: 800,
      delay: 100,
      ease: 'Power2',
    })
  }

  update() {
    if (this.scene.newScoreText.active) {
      this.scene.newScoreText.y -= 1
      this.scene.newScoreText.alpha -= 0.01
      if (this.scene.newScoreText.alpha <= 0)
        this.scene.newScoreText.setActive(false)
    }
  }

  onUpdateTimer() {
    this.scene.timerValue--
    this.scene.roundTimer > 1 && this.scene.roundTimer--
    if (this.scene.timerValue <= -1) {
      this.music.stop()
      this.buzzerSound.play()
      this.scene.start('Menu', { score: this.scene.score })
      return
    }
    this.scene.innerBar.scaleX = this.scene.timerValue / TIMER_MAX
  }
  getScore() {
    const levelModifier = (this.scene.level + 1) / 2
    const baseScore = Math.min(this.scene.roundTimer, 30) * 10
    return baseScore * levelModifier
  }

  onFailure() {
    this.scene.timerValue -= 2
    this.scene.cameras.main.shake(450, 0.01)
    this.scene.whoopsSound.play()
    this.scene.innerBar.scaleX = this.scene.timerValue / TIMER_MAX

    this.scene.time.addEvent({
      delay: 2500,
      callback: () => {
        this.scene.canSubmit = true
        this.scene.submitButton.alpha = 1
      },
    })
  }

  onSuccess() {
    this.scene.successSound.play()

    this.scene.score += this.getScore()
    this.scene.scoreText.text = this.scene.score
    this.scene.newScoreText
      .setPosition(this.scene.width / 2, this.scene.height / 2)
      .setActive(true)
      .setAlpha(1)
      .setText(`+${this.getScore()}`)
      .setDepth(5)
      .setOrigin(0.5)

    this.scene.timerValue += Math.floor(this.scene.roundTimer / 3)
    this.scene.timerValue = Math.min(TIMER_MAX, this.scene.timerValue)
    this.scene.innerBar.scaleX = this.scene.timerValue / TIMER_MAX
  }
}
