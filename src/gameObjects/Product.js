import { TEXT_CONFIG } from '..'

class ProductContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, value) {
    super(scene, x, y)
    this.sprite = new Product(scene, 0, 0)
    this.add(this.sprite)
    this.setSize(this.sprite.width, this.sprite.height)
    this.scene = scene
    this.value = value
    this.setInteractive()

    this.on('pointerover', () => {
      this.text.alpha = 1
    })
    this.on('pointerout', () => {
      this.text.alpha = 0
    })

    this.text = this.scene.add
      .text(-60, -40, (this.value / 100).toFixed(2), {
        ...TEXT_CONFIG,
        fontSize: 60,
      })
      .setShadow(2, 2, '#333333', 2, false, true)
    this.add(this.text)

    this.text.alpha = 0
    scene.productGroup.add(this, true)
  }
}

export default ProductContainer

class Product extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'product')
    this.scene = scene
    this.scene.physics.world.enable(this)
    this.setOrigin(0.5)
    this.setDrag(600, 600)
    this.setAngularDrag(100)
    this.setScale(0.75)
    this.setCollideWorldBounds(true, 0.4, 0.4)
  }
}
