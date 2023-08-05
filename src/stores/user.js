import { defineStore } from 'pinia'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import currencies from '../assets/currencies'
import data from '../assets/defaultAccount'

const db = getFirestore()
const types = ['assets', 'liabilities']

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: null,
    data,
    currency: 'CHF',
    exchangeRates: {}
  }),
  getters: {
    currencies () {
      return currencies
    },
    isSignedIn (state) {
      return !!state.id
    },
    summary (state) {
      const summary = {}
      types.forEach(type => {
        summary[type] = {
          quantity: this.getTotalQuantity(state.data[type]),
          quantityPerYear: this.getTotalPerYear(state.data[type]),
          interests: state.data[type]
            .reduce((a, item) => a + this.getMainCurrencyQuantity(item.quantity, item.currency) * item.interest / 100, 0)
        }
      })
      return summary
    },
    prevision (state) {
      if (!state.data) return 0
      const prevision = {
        assets: state.data.assets,
        liabilities: state.data.liabilities,
        inflation: 1
      }
      const inflationRate = (100 - state.data.inflation) / 100
      for (let i = 0; i < state.data.previsionYears; i++) {
        types.forEach(type => {
          prevision[type] = prevision[type].map(item => ({
            ...item,
            quantity: item.quantity + item.quantity * item.interest / 100 + item.quantityPerYear
          }))
        })
        prevision.inflation *= inflationRate
      }
      prevision.worth = this.getTotalQuantity(prevision.assets) - this.getTotalQuantity(prevision.liabilities)
      prevision.interests = prevision.assets
        .reduce((a, item) => a + this.getMainCurrencyQuantity(item.quantity, item.currency) * item.interest / 100, 0)
      return prevision
    }
  },
  actions: {
    async get (authUser) {
      const docSnap = await getDoc(doc(db, 'users', authUser.uid))
      this.id = authUser.uid
      if (docSnap.exists()) {
        this.data = {
          ...this.data,
          ...docSnap.data()
        }
      }
    },
    async save () {
      types.forEach(type => {
        this.data[type] = this.data[type].map(data => {
          return {
            ...data,
            quantityPerYear: data.quantityChange * this.getFrequencyMultiplier(data.frequency)
          }
        })
      })
      if (this.id) {
        await setDoc(doc(db, 'users', this.id), this.data)
      }
    },
    getTotalQuantity (items) {
      return Math.floor(items?.reduce((a, item) => a + this.getMainCurrencyQuantity(item.quantity, item.currency), 0))
    },
    getTotalPerYear (items) {
      return Math.floor(items?.reduce((a, item) => a + this.getMainCurrencyQuantity(item.quantityPerYear, item.currency), 0))
    },
    getFrequencyMultiplier (frequency) {
      switch (frequency) {
        case 'monthly': return 12
        case 'weekly': return 52
        case 'daily': return 365
      }
      return 1
    },
    getMainCurrencyQuantity (quantity, currency) {
      if (this.currency === currency) return quantity
      return quantity * (this.getExchangeRate(currency) || 0)
    },
    async getExchangeRate (currency) {
      const mainCurrency = this.currency.toLowerCase()
      if (this.exchangeRates[currency + this.currency]) {
        const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currency.toLowerCase()}/${mainCurrency}.json`)
        this.exchangeRates[currency + this.currency] = (await response.json())[mainCurrency]
      }
      return this.exchangeRates[currency + this.currency]
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
