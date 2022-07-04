import { defineStore } from 'pinia'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const db = getFirestore()

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null
  }),
  getters: {
    isSignedIn (state) {
      return !!state.user
    }
  },
  actions: {
    async get (authUser) {
      const docSnap = await getDoc(doc(db, 'users', authUser.uid))
      if (docSnap.exists()) {
        this.user = {
          id: docSnap.id,
          data: docSnap.data()
        }
      } else {
        this.user = {
          id: authUser.uid,
          data: {
            accounts: []
          }
        }
      }
    },
    async save () {
      await setDoc(doc(db, 'users', this.user.id), this.user.data)
    }
  }
})
