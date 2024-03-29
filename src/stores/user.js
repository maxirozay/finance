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
          value: this.getTotalValue(state.data[type]),
          valuePerYear: this.getTotalPerYear(state.data[type]),
          interests: state.data[type]
            .reduce((a, item) => a + (this.getMainCurrencyValue(item.value, item.currency) * item.interest / 100 || 0), 0)
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
      prevision.liabilities = prevision.liabilities.map(item => ({
        ...item,
        paid: 0
      }))
      for (let i = 0; i < state.data.previsionYears; i++) {
        prevision.assets = prevision.assets.map(item => ({
          ...item,
          value: item.value + item.value * item.interest / 100 + item.valuePerYear
        }))
        prevision.liabilities = prevision.liabilities.map(item => {
          if (item.duration) {
            if (item.paid >= item.value) return item
            return {
              ...item,
              value: item.value + (item.value - item.paid) * item.interest / 100,
              paid: item.paid + item.valuePerYear
            }
          }
          return {
            ...item,
            value: item.value + item.valuePerYear
          }
        })
        prevision.inflation *= inflationRate
      }
      prevision.worth = this.getTotalValue(prevision.assets) - this.getTotalValue(prevision.liabilities)
      prevision.interests = prevision.assets
        .reduce((a, item) => a + this.getMainCurrencyValue(item.value, item.currency) * item.interest / 100, 0)
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
      this.getExchangeRates()
    },
    async save () {
      if (this.id) {
        await setDoc(doc(db, 'users', this.id), this.data)
      }
      this.getExchangeRates()
    },
    getTotalValue (items) {
      return Math.floor(items?.reduce((a, item) => a + this.getMainCurrencyValue(item.value, item.currency), 0))
    },
    getTotalPerYear (items) {
      return Math.floor(items?.reduce((a, item) => a + this.getMainCurrencyValue(item.valuePerYear, item.currency), 0))
    },
    getFrequencyMultiplier (frequency) {
      switch (frequency) {
        case 'monthly': return 12
        case 'weekly': return 52
        case 'daily': return 365
      }
      return 1
    },
    getMainCurrencyValue (value, currency) {
      if (this.currency === currency) return value
      return value * (this.exchangeRates[currency + this.currency] || 1)
    },
    async getExchangeRates () {
      const mainCurrency = this.currency.toLowerCase()
      for (const type of types) {
        for (const item of this.data[type]) {
          if (!this.exchangeRates[item.currency + this.currency] && item.currency !== this.currency) {
            const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${item.currency.toLowerCase()}/${mainCurrency}.json`)
            this.exchangeRates[item.currency + this.currency] = (await response.json())[mainCurrency]
          }
        }
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
