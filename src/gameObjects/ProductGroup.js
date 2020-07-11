import Product from './Product'
import Money, { VALUES } from './Money'
import { DURATION_FACTOR } from '..'
export class ProductGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.scene = scene
  }

  createProducts() {
    const thing = [...this.getChildren()]
    thing.forEach((p) => {
      p.destroy()
      p.value = 0
    })

    for (let i = 0; i < 4; i++) {
      new Product(
        this.scene,
        120 + 180 * i,
        730,
        Math.floor(1 + Math.random() * 3) * 100,
        i,
      )
    }
    const total = this.getTotalValue()
    const money = new Money(
      this.scene,
      this.scene.width - 200,
      770,
      [...VALUES].reverse().find((v) => v >= total),
      {
        x: -200,
        y: 500,
        angle: 5,
        draggable: false,
        delay: 1500 * DURATION_FACTOR,
      },
    )
    money.setTint(0xff0000)
  }

  getTotalValue() {
    return [...this.getChildren()]
      .filter((c) => c.active)
      .reduce((sum, child) => sum + child.value, 0)
  }
}
