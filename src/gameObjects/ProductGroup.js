import Product from './Product'
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
        300,
        Math.floor(1 + Math.random() * 2) * 100,
      )
    }
  }

  getTotalValue() {
    return this.getChildren()
      .filter((c) => c.active)
      .reduce((sum, child) => sum + child.value, 0)
  }
}
