import Phaser from 'phaser'
import * as scenes from './scenes'
import BehaviorPlugin from './behavior'

var config = {
  type: Phaser.AUTO,
  width: 1080,
  height: 1920,
  backgroundColor: '#1d332f',
  parent: 'phaser-example',
  plugins: {
    global: [{ key: 'BehaviorPlugin', plugin: BehaviorPlugin, start: true }],
  },
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

export const TEXT_CONFIG = {
  fontFamily: 'AnotherHand',
  fontSize: 100,
  align: 'center',
  color: '#ffffff',
}

export const DURATION_FACTOR = 1
