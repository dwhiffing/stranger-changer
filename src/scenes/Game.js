import { MoneyGroup } from '../gameObjects/MoneyGroup'
import { ProductGroup } from '../gameObjects/ProductGroup'
import Customer from '../gameObjects/Customer'
import { UiGroup } from '../gameObjects/uiGroup'
import { PROGRESSION, LEVELS } from '..'

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.width = this.cameras.main.width
    this.height = this.cameras.main.height
    this.behavior = this.plugins.get('BehaviorPlugin')

    this.music = this.sound.add('gameMusic', { loop: true, volume: 0.35 })
    this.cash1Sound = this.sound.add('cash1Sound', { volume: 0.3 })
    this.cash2Sound = this.sound.add('cash2Sound', { volume: 0.4 })
    this.coin1Sound = this.sound.add('coin1Sound', { volume: 0.2 })
    this.coin2Sound = this.sound.add('coin2Sound', { volume: 0.5 })
    this.buzzerSound = this.sound.add('buzzerSound')
    this.whoopsSound = this.sound.add('whoopsSound')
    this.successSound = this.sound.add('successSound')
    this.registerSound = this.sound.add('registerSound', { volume: 0.5 })
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
    this.cashBreakdownSound = this.sound.add('cashBreakdownSound')
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
    this.input.on('drag', (_, money, dragX, dragY) => {
      money.x = dragX
      money.y = dragY
    })
    this.input.on('pointerup', () =>
      this.moneyGroup.getChildren().forEach((c) => c.onDrop(false)),
    )

    this.nextCustomer()
  }

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

    if (this.moneyGroup.getIsPlayerCorrect()) {
      this.uiGroup.onSuccess()
      this.customer.happy()

      this.time.addEvent({
        delay: 500,
        callback: this.endRound.bind(this),
      })
    } else {
      this.uiGroup.onFailure()
      this.customer.sad()
    }
  }

  endRound() {
    this.moneyGroup.destroyPresentedMoney()
    this.moneyGroup.giveCustomerMoneyToPlayer()
    this.productGroup.destroyPresentedProducts()
    this.customer && this.customer.destroy()

    this.time.addEvent({
      delay: 1000,
      callback: this.nextCustomer.bind(this),
    })
  }

  nextCustomer() {
    this.roundTimer = 35 + 5 * this.level
    this.customer = new Customer(this, 500, 400, Phaser.Math.RND.between(0, 3))
    this.numCustomers++

    const difficulty = LEVELS[this.level]
    this.productGroup.createProducts(
      Phaser.Math.RND.between(difficulty.minProducts, difficulty.maxProducts),
      difficulty.productIndexes,
    )
    this.targetValue = this.productGroup.getTotalValue()
    this.moneyGroup.presentCustomerMoney(() => {
      this.canSubmit = true
      this.submitButton.alpha = 1
    })

    if (this.numCustomers > PROGRESSION[this.level]) {
      this.level++
    }
  }
}
