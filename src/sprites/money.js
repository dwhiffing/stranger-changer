export default class extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value) {
    let sprite = value >= 100 ? 'cash' : 'change'

    super(scene, x, y, sprite)

    if (value === 2000 || value === 25) {
      this.setFrame(0)
    }

    if (value === 1000 || value === 10) {
      this.setFrame(1)
    }

    if (value === 500 || value === 5) {
      this.setFrame(2)
    }

    if (value === 100 || value === 1) {
      this.setFrame(3)
    }

    scene.add.existing(this)
    this.scene = scene
    this.originX = 0.5
    this.originY = 0.5

    this.setInteractive()

    scene.input.setDraggable(this)

    this.on('pointerover', () => {
      this.setTint(0x44ff44)
    })

    this.on('pointerout', () => {
      this.clearTint()
    })
  }
}
