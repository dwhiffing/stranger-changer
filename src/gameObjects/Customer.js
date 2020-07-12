import { DURATION_FACTOR } from '..'
//TODO: ensure same customer can't go twice in a row
export default class Customer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0, frame = 0) {
    super(scene, -300, y, 'customer')
    this.scene = scene
    this.setOrigin(0.5)
    this.setDepth(-2)
    this.setFrame(frame * 3)
    this.setScale(1.25)
    this.frameIndex = frame * 3
    this.customerType = frame
    this.scene.tweens.add({
      targets: [this],
      x: x,
      y: y,
      duration: 500 * DURATION_FACTOR,
      ease: 'Power2',
    })
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
}
