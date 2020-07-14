import { TEXT_CONFIG } from '..'
import { Product, PRICES } from './Product'

class ClipboardModal extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0)
    this.background = this.scene.add.image(0, 0, 'clipboard')
    this.background.setOrigin(0, 0)
    this.setDepth(3)
    this.y = this.scene.height
    this.add(this.background)
    for (let i = 0; i < 8; i++) {
      const x = 235 + (i % 4) * 180
      const y = i >= 4 ? 980 : 760
      let sprite = new Product(scene, x + 45, y)
      sprite.setScale(0.6)
      this.add(sprite)
      sprite.setFrame(i)
      let text = this.scene.add.text(
        x - 20,
        y + 77,
        `$${(PRICES[i] / 100).toFixed(2)}`,
        {
          ...TEXT_CONFIG,
          color: '#000',
          fontSize: 50,
          align: 'center',
        },
      )
      text.setSize(50, 50)
      this.add(text)
    }

    this.text = this.scene.add
      .text(-60, -40, 100, {
        ...TEXT_CONFIG,
        fontSize: 60,
      })
      .setShadow(2, 2, '#333333', 2, false, true)
    this.add(this.text)

    this.text.alpha = 0
    this.scene.add.existing(this)
  }

  destroy() {
    this.value = 0
    this.scene.tweens.add({
      targets: [this],
      x: this.scene.width + 300,
      angle: Phaser.Math.RND.between(-30, 30),
      duration: 1000,
      ease: 'Power2',
      delay: this.index * 100,
      onComplete: () => {
        super.destroy()
      },
    })
  }
}

export default ClipboardModal
