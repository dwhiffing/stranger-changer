import { DRAGGABLE } from '../behaviors/draggable'
import { DURATION_FACTOR } from '..'
const defaultProps = {
  x: 200,
  y: 200,
  angle: 2,
  alpha: 1,
  index: 0,
  draggable: true,
  instant: false,
  onComplete: () => {},
  delay: 0,
}
class Money extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, value, props = {}) {
    let sprite = value >= 100 ? 'cash' : 'change'
    props = { ...defaultProps, ...props }

    super(
      scene,
      props.instant ? x : props.x,
      props.instant ? y : props.y,
      sprite,
    )

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
    this.breakdown = this.breakdown.bind(this)
    this.makeDraggable = this.makeDraggable.bind(this)
    this.onClick = this.onClick.bind(this)

    this.scene = scene
    this.value = value
    this.setOrigin(0.5)
    this.setDrag(1200, 1200)
    this.setScale(0.75)
    this.setAngularDrag(100)
    if (!props.instant) {
      this.scene.tweens.add({
        targets: [this],
        alpha: props.alpha,
        x: x + props.index * 20,
        y: y + Math.random() * 5 + props.index * 50,
        angle: Phaser.Math.RND.between(-props.angle, props.angle),
        duration: 500 * DURATION_FACTOR,
        delay: props.delay + props.index * 500 * DURATION_FACTOR,
        ease: 'Power2',
        onComplete: () => {
          props.onComplete && props.onComplete()
          this.onDrop(true)
          this.setCollideWorldBounds(true, 0.2, 0.2)
        },
      })
    } else {
      this.setCollideWorldBounds(true, 0.2, 0.2)
    }

    this.scene.behavior.enable(this)
    if (props.draggable) {
      this.makeDraggable()
    }
    this.setTint(value >= 100 ? 0x66bb66 : 0x999999)
    // this.on('pointerover', () =>
    //   this.setTint(value >= 100 ? 0x22aa22 : 0xffffff),
    // )
    // this.on('pointerout', () =>
    //   this.setTint(value >= 100 ? 0x66bb66 : 0x999999),
    // )
    this.setDepth(value >= 100 ? 0 : 1)
  }

  update() {
    if (this.y < this.scene.height * 0.66 && this.draggable) {
      this.setTint(this.value >= 100 ? 0x00ff00 : 0xffffff)
    } else {
      this.setTint(this.value >= 100 ? 0x66bb66 : 0x999999)
    }
  }

  breakdown() {
    const bills = AMOUNTS[VALUES.indexOf(this.value)]
    bills.forEach((value, index, arr) => {
      const num = arr.length
      const money = new Money(this.scene, this.x, this.y, value, {
        instant: true,
      })
      const veloX = (index - num * 0.5) * 100
      const veloY = (index - num * 0.5) * 100
      money.setVelocity(veloX, veloY)
      money.setAcceleration(0, 0)
      money.setAngularVelocity((index - num * 0.5) * 30)
    })
    if (this.value > 100) {
      this.scene.cashBreakdownSound.play()
    } else {
      this.scene.coinBreakdownSound.play()
    }
    this.destroy(true)
  }

  onClick() {
    this.scene.tweens.add({
      targets: [this],
      scale: 0.85,
      ease: 'Power2',
      duration: 200,
    })

    if (this.wasClicked && this.value > 1) {
      this.breakdown()
    }

    if (this.value >= 100) {
      this.scene && this.scene.cash1Sound.play()
    } else {
      this.scene && this.scene.coin1Sound.play()
    }

    this.wasClicked = true

    this.scene &&
      this.scene.time.addEvent({
        delay: 500 * DURATION_FACTOR,
        callback: () => {
          this.wasClicked = false
        },
      })
  }

  onDrop(playSound = false) {
    this.scene.tweens.add({
      targets: [this],
      scale: 0.75,
      ease: 'Power2',
      duration: 200,
    })
    if (!playSound) return

    if (this.value >= 100) {
      this.scene && this.scene.cash2Sound.play()
    } else {
      this.scene && this.scene.coin2Sound.play()
    }
  }

  makeDraggable() {
    this.draggable = true
    this.behaviors.set('draggable', DRAGGABLE, {
      minY: this.scene.height * 0.5,
    })
    this.on('pointerdown', this.onClick)
    this.setTint(0x44dd44)
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
      x: this.scene.width + 300,
      duration: 400 * DURATION_FACTOR,
      ease: 'Power2',
      delay: this.index * 100 * DURATION_FACTOR,
      onComplete: () => {
        super.destroy()
      },
    })
  }
}

export default Money

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
