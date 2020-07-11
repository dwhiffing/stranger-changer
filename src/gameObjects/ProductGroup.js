import Product from './Product'
import Money, { VALUES } from './Money'
import { DURATION_FACTOR } from '..'
export class ProductGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.scene = scene
  }

  createProducts(number = 1, indexes = [0]) {
    const thing = [...this.getChildren()]
    thing.forEach((p) => {
      p.destroy()
      p.value = 0
    })

    for (let i = 0; i < number; i++) {
      new Product(
        this.scene,
        120 + 180 * (i % 4),
        730 + (i >= 4 ? 200 : 0),
        i,
        Phaser.Math.RND.pick(indexes),
      )
    }
  }

  getTotalValue() {
    return [...this.getChildren()]
      .filter((c) => c.active)
      .reduce((sum, child) => sum + child.value, 0)
  }
}
