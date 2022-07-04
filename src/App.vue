<script setup>
import { useRouter, useRoute } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useUserStore } from '@/stores/user'

const auth = getAuth()
const user = useUserStore()
const router = useRouter()
const route = useRoute()

function checkSignIn () {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      email = window.prompt('Please provide your email for confirmation')
    }
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        window.localStorage.removeItem('emailForSignIn')
      })
      .catch((error) => {
        error = error.message
      })
  }
}
onAuthStateChanged(auth, async (authUser) => {
  if (authUser) {
    await user.get(authUser)
    if (route.query.continueUrl) {
      router.push(route.query.continueUrl)
    } else {
      router.push('/')
    }
  } else {
    user.$reset()
    router.push('/')
  }
})
checkSignIn()
</script>

<template>
  <RouterView />
  <nav>
    <RouterLink
      v-if="user.isSignedIn"
      to="signin"
      @click="signOut(auth)"
    >
      Sign out
    </RouterLink>
  </nav>
</template>

<style>
@import '@/assets/base.css';

#app {
  margin: 0 auto;
  font-weight: normal;
}

nav {
  text-align: center;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  z-index: 1;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
nav a {
  display: inline-block;
  padding: 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}

select,
button {
  background-color: hsla(160, 100%, 37%, 1);
  padding: .25em .5em;
  margin: .25em 0;
  border: 0;
  border-radius: 2px;
  font-size: inherit;
}
button:not(:first-of-type) {
  margin-left: .25em;
}

select {
  padding: .2em;
}

a,
label {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}

body {
  display: flex;
  place-items: center;
}
</style>
