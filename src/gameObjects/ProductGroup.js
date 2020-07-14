import Product from './Product'
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
        110 + 190 * (i % 4),
        720 + (i >= 4 ? 160 : 0),
        i,
        Phaser.Math.RND.pick(indexes),
      )
    }
  }

  getTotalValue() {
    return [...this.getChildren()].reduce(
      (sum, child) => sum + Number(child.value) || 0,
      0,
    )
  }
}
