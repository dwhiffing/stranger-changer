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

export const PROGRESSION = [3, 7, 10, 15, 20, 25, 30, 35]
export const LEVELS = [
  { minProducts: 1, maxProducts: 2, productIndexes: [0, 1] },
  { minProducts: 2, maxProducts: 4, productIndexes: [0, 1] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2, 3] },
  { minProducts: 3, maxProducts: 6, productIndexes: [0, 1, 2, 3, 4] },
  { minProducts: 3, maxProducts: 7, productIndexes: [1, 2, 3, 4, 5] },
  { minProducts: 3, maxProducts: 8, productIndexes: [2, 3, 4, 5, 6] },
  { minProducts: 4, maxProducts: 8, productIndexes: [3, 4, 5, 6, 7] },
]
