import { defineStore } from 'pinia'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const db = getFirestore()

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: null,
    data: null
  }),
  getters: {
    isSignedIn (state) {
      return !!state.data
    },
    totalAccounts (state) {
      return this.getTotal(state.data?.accounts)
    },
    totalInterests (state) {
      return state.data?.accounts
        .reduce((a, account) => a + account.quantity * account.interest / 100, 0)
    },
    totalIncomes (state) {
      return this.getTotal(state.data?.incomes)
    },
    totalOutcomes (state) {
      return this.getTotal(state.data?.outcomes)
    },
    prevision (state) {
      let wealth = 0
      let accounts = state.data.accounts
      const savings = state.totalIncomes - state.totalOutcomes
      for (let i = 0; i < state.data.previsionYears; i++) {
        accounts = accounts.map(account => ({
          ...account,
          quantity: account.quantity + account.quantity * account.interest / 100
        }))
        wealth += savings + wealth * state.data.savingsInterest / 100
      }
      updateDoc(doc(db, 'users', state.id), {
        previsionYears: state.data.previsionYears,
        savingsInterest: state.data.savingsInterest
      })
      return wealth + state.getTotal(accounts)
    }
  },
  actions: {
    async get (authUser) {
      const docSnap = await getDoc(doc(db, 'users', authUser.uid))
      this.id = authUser.uid
      if (docSnap.exists()) {
        this.data = docSnap.data()
      } else {
        this.data = {
          accounts: [],
          incomes: [],
          outcomes: [],
          previsionYears: 1,
          savingsInterest: 0
        }
      }
    },
    async save () {
      await setDoc(doc(db, 'users', this.id), this.data)
    },
    getTotal (items) {
      return items?.reduce((a, item) => a + item.quantity * this.getFrequencyMultiplier(item.frequency), 0)
    },
    getFrequencyMultiplier (frequency) {
      switch (frequency) {
        case 'monthly': return 12
        case 'weekly': return 52
        case 'daily': return 365
      }
      return 1
    }
  }
})
