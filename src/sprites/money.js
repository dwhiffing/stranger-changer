export const VALUES = [2000, 1000, 500, 100, 25, 10, 5, 1]
export const AMOUNTS = [
  [1000, 1000],
  [500, 500],
  [100, 100, 100, 100, 100],
  [25, 25, 25, 25],
  [10, 10, 5],
  [5, 5],
  [1, 1, 1, 1, 1],
  [],
]

class Money extends Phaser.Physics.Arcade.Sprite {
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

    scene.monies.add(this, true)
    this.scene = scene
    this.value = value
    this.originX = 0.5
    this.originY = 0.5

    this.setInteractive()

    scene.input.setDraggable(this)

    this.on('pointerdown', () => {
      if (this.wasClicked && this.value > 1) {
        const breakdown = AMOUNTS[VALUES.indexOf(this.value)]
        breakdown.forEach((value) => {
          new Money(
            this.scene,
            this.x + Phaser.Math.RND.between(-60, 60),
            this.y + Phaser.Math.RND.between(-60, 60),
            value,
          )
        })
        this.destroy()
      }

      this.wasClicked = true

      this.scene &&
        this.scene.time.addEvent({
          delay: 300,
          callback: () => {
            this.wasClicked = false
          },
        })
    })

    this.on('pointerover', () => {
      this.setTint(0x44ff44)
      this.setDepth(1)
    })

    this.on('pointerout', () => {
      this.setDepth(0)
      this.clearTint()
    })
  }
}

export default Money
