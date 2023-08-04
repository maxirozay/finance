import { defineStore } from 'pinia'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import currencies from '../assets/currencies'

const db = getFirestore()

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: null,
    data: {
      accounts: [],
      incomes: [],
      investments: [],
      expenses: [],
      previsionYears: 1,
      savingsInterest: 0,
      investmentsInterest: 5,
      inflation: 1,
      frequency: 'yearly'
    },
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
    totalInvestments (state) {
      return this.getTotal(state.data?.investments)
    },
    totalExpenses (state) {
      return this.getTotal(state.data?.expenses)
    },
    totalSavings (state) {
      return state.totalIncomes - state.totalExpenses - state.totalInvestments
    },
    prevision (state) {
      if (!state.data) return 0
      let accounts = state.data.accounts
      let savings = 0
      let investments = 0
      let savingsInterests = 0
      let investmentsInterests = 0
      let inflation = 1
      const inflationRate = (100 - state.data.inflation) / 100
      for (let i = 0; i < state.data.previsionYears; i++) {
        accounts = accounts.map(account => ({
          ...account,
          quantity: account.quantity + account.quantity * account.interest / 100
        }))
        savingsInterests = savings * state.data.savingsInterest / 100
        savings += state.totalSavings + savingsInterests
        investmentsInterests = investments * state.data.investmentsInterest / 100
        investments += state.totalInvestments + investmentsInterests
        inflation *= inflationRate
      }
      return {
        interests: savingsInterests + investmentsInterests,
        savingsInterests,
        investmentsInterests,
        worth: Math.round(savings + investments + state.getTotal(accounts)),
        inflation
      }
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
      ['incomes', 'investments', 'expenses'].forEach(type => {
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
      return quantity * (this.getExchangeRate(item.currency) || 0)
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
