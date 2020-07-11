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
}
