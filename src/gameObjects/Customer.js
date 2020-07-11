import { DURATION_FACTOR } from '..'

export default class Customer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0, frame = 0) {
    super(scene, -300, y, 'customer')
    this.scene = scene
    this.setOrigin(0.5)
    this.setDepth(-1)
    this.setFrame(frame)
    this.alpha = 0.5
    this.scene.tweens.add({
      targets: [this],
      x: x,
      y: y,
      duration: 500 * DURATION_FACTOR,
      ease: 'Power2',
    })
  }
}
