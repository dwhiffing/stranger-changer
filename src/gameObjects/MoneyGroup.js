import Money, { VALUES } from './Money'
export class MoneyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.scene = scene
  }

  createMoney() {
    const INITIAL_VALUES = [2000, 1000, 500, 100]
    for (let i = 0; i < 4; i++) {
      new Money(
        this.scene,
        143 + 265 * i,
        this.scene.height - 460,
        INITIAL_VALUES[i],
        {
          x: 143 + 265 * i,
          y: this.scene.height + 300,
        },
      )
    }
  }

  getCustomer() {
    const customerMoney = this.scene.moneyGroup
      .getChildren()
      .filter((t) => !t.draggable)
    const value = customerMoney.reduce((sum, t) => sum + t.value, 0)
    return { sprites: customerMoney, value: value }
  }

  getPresented() {
    const presentedMoney = this.getChildren().filter(
      (t) => t.draggable && t.y < this.scene.height * 0.66,
    )
    const valuePresented = presentedMoney.reduce((sum, t) => sum + t.value, 0)
    return { sprites: presentedMoney, value: valuePresented }
  }

  getIsPlayerCorrect() {
    const presented = this.getPresented()
    const customerMoney = this.getCustomer()
    return presented.value === customerMoney.value - this.scene.targetValue
  }

  destroyPresentedMoney() {
    this.getPresented().sprites.forEach((p) => p.destroy())
  }

  giveCustomerMoneyToPlayer() {
    this.getCustomer().sprites.forEach((s) => {
      s.makeDraggable()
      this.scene.tweens.add({
        targets: [s],
        angle: Phaser.Math.RND.between(-90, 90),
        x: Phaser.Math.RND.between(50, this.scene.width - 50),
        y: this.scene.height * 0.77,
        duration: 700,
        delay: 100,
        ease: 'Power2',
      })
    })
  }

  presentCustomerMoney(onComplete) {
    let remainingFundsToPresent = this.scene.targetValue
    let index = 0
    while (remainingFundsToPresent > 0) {
      index++
      const closestValue =
        [...VALUES].reverse().find((v) => v >= remainingFundsToPresent) || 2000
      remainingFundsToPresent -= closestValue
      new Money(this.scene, this.scene.width - 250, 800, closestValue, {
        x: -200,
        y: 500,
        index,
        draggable: false,
        delay: 1000,
        onComplete,
      })
    }
  }
}
