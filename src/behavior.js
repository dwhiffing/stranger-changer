import BehaviorSystem from 'behavior-system'

export default class BehaviorPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super('BehaviorPlugin', pluginManager)
  }

  init() {
    this._system = new BehaviorSystem()
  }

  enable(gameObject) {
    let enabled = false

    enabled = this._system.enable(gameObject)

    if (
      enabled === true &&
      gameObject.events !== undefined &&
      gameObject.events.onDestroy !== undefined
    ) {
      gameObject.events.onDestroy.add(this._onDestroyCallback, this._system)
    }

    return enabled
  }

  disable(gameObject, removeListener = true) {
    const disabled = this._system.disable(gameObject)
    if (disabled === true && removeListener === true) {
      if (
        gameObject.events !== undefined &&
        gameObject.events.onDestroy !== undefined
      ) {
        gameObject.events.onDestroy.remove(
          this._onDestroyCallback,
          this._system,
        )
      }
    }
    return disabled
  }

  preUpdate() {
    this._system.globalProcessAll('preUpdate', this.game)
  }

  update() {
    this._system.globalProcessAll('update', this.game)
    this._system.globalProcessAll('postUpdate', this.game)
  }

  render() {
    this._system.globalProcessAll('preRender', this.game)
    this._system.globalProcessAll('render', this.game)
  }

  postRender() {
    this._system.globalProcessAll('postRender', this.game)
  }

  _onDestroyCallback(gameObject) {
    this.disable(gameObject, false)
  }
}
