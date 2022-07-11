import { defineStore } from 'pinia'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const db = getFirestore()

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: null,
    data: {
      accounts: [],
      incomes: [],
      expenses: [],
      previsionYears: 1,
      savingsInterest: 0
    },
    currency: 'CHF',
    currencies: ['ADA', 'BNB', 'BTC', 'CHF', 'ETH', 'EURO', 'USD', 'XRP'],
    exchangeRates: {}
  }),
  getters: {
    isSignedIn (state) {
      return !!state.id
    },
    totalAccounts (state) {
      return this.getTotal(state.data?.accounts)
    },
    totalInterests (state) {
      return Math.floor(state.data?.accounts
        .reduce((a, account) => a + this.getMainCurrencyQuantity(account) * account.interest / 100, 0))
    },
    totalIncomes (state) {
      return this.getTotal(state.data?.incomes)
    },
    totalExpenses (state) {
      return this.getTotal(state.data?.expenses)
    },
    prevision (state) {
      if (!state.data) return 0
      let wealth = 0
      let accounts = state.data.accounts
      const savings = state.totalIncomes - state.totalExpenses
      for (let i = 0; i < state.data.previsionYears; i++) {
        accounts = accounts.map(account => ({
          ...account,
          quantity: account.quantity + account.quantity * account.interest / 100
        }))
        wealth += savings + wealth * state.data.savingsInterest / 100
      }
      return Math.round(wealth + state.getTotal(accounts))
    }
  },
  actions: {
    async get (authUser) {
      this.getExchangeRates()

      const docSnap = await getDoc(doc(db, 'users', authUser.uid))
      this.id = authUser.uid
      if (docSnap.exists()) {
        this.data = docSnap.data()
      } else {
        this.data = {
          accounts: [],
          incomes: [],
          expenses: [],
          previsionYears: 1,
          savingsInterest: 0
        }
      }
    },
    async save () {
      ['incomes', 'expenses'].forEach(type => {
        this.data[type] = this.data[type].map(data => {
          return {
            ...data,
            quantityPerYear: data.quantity * this.getFrequencyMultiplier(data.frequency)
          }
        })
      })
      if (this.id) {
        await setDoc(doc(db, 'users', this.id), this.data)
      }
    },
    getTotal (items) {
      return Math.floor(items?.reduce((a, item) => a + this.getMainCurrencyQuantity(item), 0))
    },
    getFrequencyMultiplier (frequency) {
      switch (frequency) {
        case 'monthly': return 12
        case 'weekly': return 52
        case 'daily': return 365
      }
      return 1
    },
    getMainCurrencyQuantity (item) {
      const quantity = item.quantityPerYear || item.quantity
      if (this.currency === item.currency) return quantity
      return quantity * (this.exchangeRates[item.currency + this.currency] || 0)
    },
    async getExchangeRates () {
      const mainCurrency = this.currency.substring(0, 3).toLowerCase()
      for (const currency of this.currencies) {
        const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.substring(0, 3).toLowerCase()}/${mainCurrency}.json`)
        this.exchangeRates[currency + this.currency] = (await response.json())[mainCurrency]
      }
    },
    updatePrevisionSettings () {
      if (!this.id) return
      updateDoc(doc(db, 'users', this.id), {
        previsionYears: this.data.previsionYears,
        savingsInterest: this.data.savingsInterest
      })
    }
  }
})
