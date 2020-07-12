import { DURATION_FACTOR } from '..'

export default class Customer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0, frame = 0) {
    super(scene, -300, y, 'customer')
    this.scene = scene
    this.setOrigin(0.5)
    this.setDepth(-2)
    this.setFrame(frame * 3)
    this.setScale(1.25)
    this.frameIndex = frame
    this.scene.tweens.add({
      targets: [this],
      x: x,
      y: y,
      duration: 500 * DURATION_FACTOR,
      ease: 'Power2',
    })
  }
}
