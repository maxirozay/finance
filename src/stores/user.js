import { defineStore } from 'pinia'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

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
      return state.data?.outcomes
        .reduce((a, outcome) => {
          if (outcome.frequency === 'yearly') {
            return a + outcome.quantity
          } else if (outcome.frequency === 'monthly') {
            return a + outcome.quantity * 12
          }
          return a + outcome.quantity * 52
        }, 0)
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
          outcomes: []
        }
      }
    },
    async save () {
      await setDoc(doc(db, 'users', this.id), this.data)
    },
    getTotal (items) {
      return items?.reduce((a, item) => a + item.quantity, 0)
    }
  }
})
