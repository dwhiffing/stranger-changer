import Phaser from 'phaser'
import * as scenes from './scenes'

var config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 1920,
  backgroundColor: '#166273',
  parent: 'phaser-example',
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: Object.values(scenes),
}

window.game = new Phaser.Game(config)
