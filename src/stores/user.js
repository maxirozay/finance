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
          incomes: []
        }
      }
    },
    async save () {
      await setDoc(doc(db, 'users', this.user.id), this.user.data)
    }
  }
})
