export const DRAGGABLE = {
  options: {
    // speed: 550,
    // turnRate: 5,
    // getShouldAvoid: null,
  },

  $create: function (entity, opts) {
    entity.setInteractive()
    entity.scene.input.setDraggable(entity)
    entity.moveTimer = 5
    entity.lastX = entity.x
    entity.lastY = entity.y
    entity.onDrag = () => {
      if (entity.moveTimer-- === 0) {
        entity.lastX = entity.x
        entity.lastY = entity.y
        entity.moveTimer = 5
      }
      if (entity.angle < -3) {
        entity.angle += 0.8
      }

      if (entity.angle > 2) {
        entity.angle -= 0.8
      }
    }

    entity.throw = () => {
      const { lastX, lastY, x, y } = entity
      entity.isHeld = false
      const angle = Phaser.Math.Angle.Between(lastX, lastY, x, y)
      const dist = Phaser.Math.Distance.Between(lastX, lastY, x, y)
      entity.setAngularVelocity(dist / 10)
      entity.scene.physics.velocityFromRotation(
        angle,
        dist * 10,
        entity.body.velocity,
      )
    }

    entity.on('pointermove', () => {
      if (entity.isHeld) {
        entity.onDrag()
      }
    })
    entity.on('pointerdown', () => {
      entity.isHeld = true
    })

    entity.on('pointerup', () => {
      entity.throw()
    })
  },

  update(entity) {},
}
