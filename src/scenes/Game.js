import { MoneyGroup } from '../gameObjects/MoneyGroup'
import { ProductGroup } from '../gameObjects/ProductGroup'
import Customer from '../gameObjects/Customer'
import Money, { VALUES } from '../gameObjects/Money'
import { UiGroup } from '../gameObjects/uiGroup'

const PROGRESSION = [3, 7, 10, 15, 20, 25, 30, 35]
const LEVELS = [
  { minProducts: 1, maxProducts: 2, productIndexes: [0, 1] },
  { minProducts: 2, maxProducts: 4, productIndexes: [0, 1] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2] },
  { minProducts: 3, maxProducts: 5, productIndexes: [0, 1, 2, 3] },
  { minProducts: 3, maxProducts: 6, productIndexes: [0, 1, 2, 3, 4] },
  { minProducts: 3, maxProducts: 7, productIndexes: [1, 2, 3, 4, 5] },
  { minProducts: 3, maxProducts: 8, productIndexes: [2, 3, 4, 5, 6] },
  { minProducts: 4, maxProducts: 8, productIndexes: [3, 4, 5, 6, 7] },
]

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.behavior = this.plugins.get('BehaviorPlugin')
    this.music = this.sound.add('gameMusic', { loop: true, volume: 0.35 })
    this.registerSound = this.sound.add('registerSound', {
      volume: 0.5,
    })
    this.manAngry1Voice = this.sound.add('manAngry1Voice')
    this.manAngry2Voice = this.sound.add('manAngry2Voice')
    this.manHappy1Voice = this.sound.add('manHappy1Voice')
    this.manHappy2Voice = this.sound.add('manHappy2Voice')
    this.manNeutral1Voice = this.sound.add('manNeutral1Voice')
    this.manNeutral2Voice = this.sound.add('manNeutral2Voice')
    this.womanAngry1Voice = this.sound.add('womanAngry1Voice')
    this.womanAngry2Voice = this.sound.add('womanAngry2Voice')
    this.womanHappy1Voice = this.sound.add('womanHappy1Voice')
    this.womanHappy2Voice = this.sound.add('womanHappy2Voice')
    this.womanNeutral1Voice = this.sound.add('womanNeutral1Voice')
    this.womanNeutral2Voice = this.sound.add('womanNeutral2Voice')
    this.buzzerSound = this.sound.add('buzzerSound', { volume: 1 })
    this.whoopsSound = this.sound.add('whoopsSound', { volume: 1 })
    this.successSound = this.sound.add('successSound', { volume: 1 })
    this.cash1Sound = this.sound.add('cash1Sound', { volume: 0.3 })
    this.cash2Sound = this.sound.add('cash2Sound', { volume: 0.4 })
    this.cashBreakdownSound = this.sound.add('cashBreakdownSound', {
      volume: 0.5,
    })
    this.coin1Sound = this.sound.add('coin1Sound', { volume: 0.2 })
    this.coin2Sound = this.sound.add('coin2Sound', { volume: 0.5 })
    this.coinBreakdownSound = this.sound.add('coinBreakdownSound', {
      volume: 0.5,
    })
    this.productDrop1Sound = this.sound.add('productDrop1Sound', {
      volume: 0.3,
    })
    this.productDrop2Sound = this.sound.add('productDrop2Sound', {
      volume: 0.3,
    })
    this.productDrop3Sound = this.sound.add('productDrop3Sound', {
      volume: 0.3,
    })
  }

  create() {
    this.score = 0
    this.level = 0
    this.numCustomers = 0

    this.moneyGroup = new MoneyGroup(this)
    this.moneyGroup.createMoney()
    this.productGroup = new ProductGroup(this)
    this.uiGroup = new UiGroup(this)

    this.music.play()
    this.input.on('drag', (pointer, money, dragX, dragY) => {
      money.x = dragX
      money.y = dragY
    })
    this.input.on('pointerup', (pointer, money, dragX, dragY) => {
      this.moneyGroup.getChildren().forEach((c) => c.onDrop(false))
    })

    this.doNextCustomer()
  }

  start() {}

  update() {
    this.behavior.preUpdate()
    this.behavior.update()
    this.moneyGroup.getChildren().forEach((c) => c.update())
    this.uiGroup.update()
  }

  onSubmit() {
    if (!this.canSubmit) return
    this.canSubmit = false
    this.submitButton.alpha = 0.5

    // TODO: move below into moneyGroup function getIsPlayerCorrect.etc
    // get value of currency presented by player
    const presented = this.moneyGroup.getPresented()
    // get cost of customer items
    const customerMoney = this.moneyGroup.getCustomer()
    const isSuccessful =
      presented.value === customerMoney.value - this.targetValue

    if (isSuccessful) {
      this.uiGroup.onSuccess()

      // TODO: move to customer function happy
      this.customer.setFrame(this.customer.frameIndex + 1)
      this.customer.vocalize('happy')

      this.time.addEvent({
        delay: 500,
        callback: this.cleanup.bind(this),
      })
      this.nextCustomer()
    } else {
      this.uiGroup.onFailure()

      // TODO: move to customer function sad
      this.customer.vocalize('sad')
      this.customer.setFrame(this.customer.frameIndex + 2)
      this.time.addEvent({
        delay: 2500,
        callback: () => {
          this.customer.setFrame(this.customer.frameIndex)
        },
      })
    }
  }

  cleanup() {
    // remove presented player currency and customer productss
    this.moneyGroup.getPresented().sprites.forEach((p) => p.destroy())
    this.productGroup.getChildren().forEach((p) => p.destroy())

    // give customer money to player
    this.moneyGroup.getCustomer().sprites.forEach((s) => {
      s.makeDraggable()
      this.tweens.add({
        targets: [s],
        angle: Phaser.Math.RND.between(-90, 90),
        x: Phaser.Math.RND.between(50, this.width - 50),
        y: this.height * 0.77,
        duration: 700,
        delay: 100,
        ease: 'Power2',
      })
    })
  }

  nextCustomer() {
    if (this.customer) {
      this.tweens.add({
        targets: [this.customer],
        x: this.width + 600,
        duration: 700,
        delay: 500,
        ease: 'Power2',
        onComplete: this.doNextCustomer.bind(this),
      })
    }
  }

  doNextCustomer() {
    const difficulty = LEVELS[this.level]

    this.productGroup.createProducts(
      Phaser.Math.RND.between(difficulty.minProducts, difficulty.maxProducts),
      difficulty.productIndexes,
    )
    this.createCustomer()
    this.presentCustomerMoney()
    this.numCustomers++
    if (this.numCustomers > PROGRESSION[this.level]) {
      this.level++
    }
    this.targetValue = this.productGroup.getTotalValue()
  }

  createCustomer() {
    this.customer && this.customer.destroy()
    this.customer = new Customer(this, 500, 400, Phaser.Math.RND.between(0, 3))
    this.customer.vocalize('neutral')

    this.add.existing(this.customer)
  }

  presentCustomerMoney() {
    let remaining = this.productGroup.getTotalValue()
    this.roundTimer = 35 + 5 * this.level
    let i = 0
    while (remaining > 0) {
      i++
      const closestValue =
        [...VALUES].reverse().find((v) => v >= remaining) || 2000
      remaining -= closestValue
      const money = new Money(this, this.width - 250, 800, closestValue, {
        x: -200,
        y: 500,
        angle: 1,
        index: i,
        draggable: false,
        onComplete: () => {
          this.canSubmit = true
          this.submitButton.alpha = 1
        },
        delay: 1000,
      })
      this.customer && money.value >= 100 && money.setTint(0x99aa99)
    }
  }
}
