//TODO: ensure same customer can't go twice in a row
export default class Customer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0, frame = 0, shouldVocalize = true) {
    super(scene, -300, y, 'customer')
    this.scene = scene
    this.setOrigin(0.5)
    this.setDepth(-2)
    this.setFrame(frame * 3)
    this.setScale(1.25)
    this.frameIndex = frame * 3
    this.customerType = frame
    shouldVocalize && this.vocalize('neutral')
    this.scene.tweens.add({
      targets: [this],
      x: x,
      y: y,
      duration: 500,
      ease: 'Power2',
    })

    this.scene.add.existing(this)
  }

  vocalize(type) {
    if (type === 'neutral') {
      if (this.customerType === 0) this.scene.manNeutral1Voice.play()
      if (this.customerType === 1) this.scene.womanNeutral1Voice.play()
      if (this.customerType === 2) this.scene.womanNeutral2Voice.play()
      if (this.customerType === 3) this.scene.manNeutral2Voice.play()
    }
    if (type === 'sad') {
      if (this.customerType === 0) this.scene.manAngry1Voice.play()
      if (this.customerType === 1) this.scene.womanAngry1Voice.play()
      if (this.customerType === 2) this.scene.womanAngry2Voice.play()
      if (this.customerType === 3) this.scene.manAngry2Voice.play()
    }
    if (type === 'happy') {
      if (this.customerType === 0) this.scene.manHappy1Voice.play()
      if (this.customerType === 1) this.scene.womanHappy1Voice.play()
      if (this.customerType === 2) this.scene.womanHappy2Voice.play()
      if (this.customerType === 3) this.scene.manHappy2Voice.play()
    }
  }

  happy() {
    this.setFrame(this.frameIndex + 1)
    this.vocalize('happy')
    this.scene.time.addEvent({
      delay: 1500,
      callback: () => {
        this.setFrame(this.frameIndex)
      },
    })
  }

  sad() {
    this.setFrame(this.frameIndex + 2)
    this.vocalize('sad')
    this.scene.time.addEvent({
      delay: 1500,
      callback: () => {
        this.setFrame(this.frameIndex)
      },
    })
  }

  destroy() {
    this.scene.tweens.add({
      targets: [this],
      x: this.scene.width + 600,
      duration: 700,
      delay: 500,
      ease: 'Power2',
      onComplete: this.destroy.bind(this),
    })
  }
}
