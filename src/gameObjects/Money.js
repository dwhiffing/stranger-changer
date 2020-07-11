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

    scene.moneyGroup.add(this, true)
    this.throw = this.throw.bind(this)
    this.breakdown = this.breakdown.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onClick = this.onClick.bind(this)

    this.scene = scene
    this.value = value
    this.originX = 1
    this.originY = 1
    this.setDrag(1200, 1200)
    this.setScale(0.75)
    this.setAngularDrag(100)
    this.setInteractive()
    this.setCollideWorldBounds(true, 0.4, 0.4)
    this.moveTimer = 50
    this.lastX = this.x
    this.lastY = this.y

    scene.input.setDraggable(this)

    this.on('pointermove', () => {
      if (this.isHeld) {
        this.onDrag()
      }
    })

    this.on('pointerup', () => {
      this.throw()
    })

    this.on('pointerdown', this.onClick)
    this.on('pointerover', () => this.setTint(0x44ff44))
    this.on('pointerout', () => this.clearTint())
    this.setDepth(value >= 100 ? 0 : 1)
  }

  breakdown() {
    const bills = AMOUNTS[VALUES.indexOf(this.value)]
    bills.forEach((value, index, arr) => {
      const num = arr.length
      const money = new Money(this.scene, this.x, this.y, value)
      const veloX = (index - num * 0.5) * 100
      const veloY = (index - num * 0.5) * 100
      money.setVelocity(veloX, veloY)
      money.setAcceleration(0, 0)
      money.setAngularVelocity((index - num * 0.5) * 30)
    })
    this.destroy(true)
  }

  throw() {
    const { lastX, lastY, x, y } = this
    this.isHeld = false
    const angle = Phaser.Math.Angle.Between(lastX, lastY, x, y)
    const dist = Phaser.Math.Distance.Between(lastX, lastY, x, y)
    this.setAngularVelocity(dist / 10)
    this.scene.physics.velocityFromRotation(angle, dist * 3, this.body.velocity)
  }

  onClick() {
    if (this.wasClicked && this.value > 1) {
      this.breakdown()
    }

    this.wasClicked = true
    this.isHeld = true

    this.scene &&
      this.scene.time.addEvent({
        delay: 300,
        callback: () => {
          this.wasClicked = false
        },
      })
  }

  onDrag() {
    if (this.moveTimer-- === 0) {
      this.lastX = this.x
      this.lastY = this.y
      this.moveTimer = 50
    }
    if (this.angle < -3) {
      this.angle += 0.8
    }

    if (this.angle > 2) {
      this.angle -= 0.8
    }
  }

  destroy(instant = false) {
    if (instant) {
      super.destroy()
      return
    }
    this.value = 0
    this.setCollideWorldBounds(false)
    this.scene.tweens.add({
      targets: [this],
      y: -600,
      duration: 1000,
      ease: 'Power2',
      delay: this.index * 100,
      onComplete: () => {
        super.destroy()
      },
    })
  }
}

export default Money

const VALUES = [2000, 1000, 500, 100, 25, 10, 5, 1]
const AMOUNTS = [
  [1000, 1000],
  [500, 500],
  [100, 100, 100, 100, 100],
  [25, 25, 25, 25],
  [10, 10, 5],
  [5, 5],
  [1, 1, 1, 1, 1],
  [],
]
