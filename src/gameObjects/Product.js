import { TEXT_CONFIG, DURATION_FACTOR } from '..'

class ProductContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y, index, frame = 0) {
    super(scene, -200, y)
    this.sprite = new Product(scene, 0, 0)
    this.add(this.sprite)
    this.index = index
    this.setSize(this.sprite.width, this.sprite.height)
    this.scene = scene
    this.frameIndex = frame
    this.sprite.setFrame(this.frameIndex)
    this.value = PRICES[this.frameIndex]
    this.setInteractive()
    // this.on('pointerover', () => {
    //   this.text.alpha = 1
    // })
    // this.on('pointerout', () => {
    //   this.text.alpha = 0
    // })

    this.scene.tweens.add({
      targets: [this],
      x: x + Math.random() * 50,
      y: y + Math.random() * 10,
      // angle: Phaser.Math.RND.between(-30, 30),
      duration: 350 * DURATION_FACTOR,
      ease: 'Power2',
      delay: 700 + index * 200 * DURATION_FACTOR,
      onComplete: () => {
        this.dropSound()
      },
    })

    // this.text = this.scene.add
    //   .text(-60, -40, (this.value / 100).toFixed(2), {
    //     ...TEXT_CONFIG,
    //     fontSize: 60,
    //   })
    //   .setShadow(2, 2, '#333333', 2, false, true)
    // this.add(this.text)

    // this.text.alpha = 0
    scene.productGroup.add(this, true)
  }

  dropSound() {
    const soundChoice = Phaser.Math.RND.between(0, 2)
    if (soundChoice === 0) {
      this.scene.productDrop1Sound.play()
    } else if (soundChoice === 1) {
      this.scene.productDrop2Sound.play()
    } else {
      this.scene.productDrop3Sound.play()
    }
  }

  wooshSound() {
    // const soundChoice = Phaser.Math.RND.between(0, 2)
    // if (soundChoice === 0) {
    //   this.scene.woosh1Sound.play()
    // } else if (soundChoice === 1) {
    //   this.scene.woosh2Sound.play()
    // } else {
    //   this.scene.woosh3Sound.play()
    // }
  }

  destroy() {
    this.value = 0
    this.wooshSound()
    this.scene.tweens.add({
      targets: [this],
      x: this.scene.width + 300,
      angle: Phaser.Math.RND.between(-30, 30),
      duration: 1000 * DURATION_FACTOR,
      ease: 'Power2',
      delay: this.index * 100 * DURATION_FACTOR,
      onComplete: () => {
        super.destroy()
      },
    })
  }
}

export default ProductContainer

export class Product extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'product')
    this.scene = scene
    this.setOrigin(0.5)
    this.setScale(1)
  }
}

export const PRICES = [100, 200, 50, 350, 425, 900, 1175, 1411]
