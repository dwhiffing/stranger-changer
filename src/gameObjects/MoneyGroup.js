import Money from './Money'
export class MoneyGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene)
    this.scene = scene
  }

  createMoney() {
    for (let i = 0; i < 4; i++) {
      new Money(
        this.scene,
        143 + 265 * i,
        this.scene.height - 300,
        Phaser.Math.RND.pick([2000, 1000, 500]),
      )
    }
  }

  getPresented() {
    const presentedMoney = this.scene.moneyGroup
      .getChildren()
      .filter((t) => t.y < this.scene.height / 2)
    const valuePresented = presentedMoney.reduce((sum, t) => sum + t.value, 0)
    return { sprites: presentedMoney, value: valuePresented }
  }
}
