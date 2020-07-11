import Product from './Product'
import Money, { VALUES } from './Money'
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
        143 + 265 * i,
        200,
        Math.floor(1 + Math.random() * 3) * 100,
        i,
      )
    }
    const total = this.getTotalValue()
    new Money(
      this.scene,
      this.scene.width / 2,
      480,
      [...VALUES].reverse().find((v) => v >= total),
      {
        y: -200,
        angle: 90,
        draggable: false,
        delay: 1000,
      },
    )
  }

  getTotalValue() {
    return [...this.getChildren()]
      .filter((c) => c.active)
      .reduce((sum, child) => sum + child.value, 0)
  }
}
