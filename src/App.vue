<script setup>
import { useRouter, useRoute } from 'vue-router'
import { getAuth, signOut, onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import { useUserStore } from '@/stores/user'
import TheLoading from './components/TheLoading.vue'
import { ref } from 'vue'

const auth = getAuth()
const user = useUserStore()
const router = useRouter()
const route = useRoute()

const showLoading = ref(true)

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
  showLoading.value = false
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
  <TheLoading :show="showLoading" />
</template>

<style>
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  --primary-color: hsla(160, 100%, 37%, 1);
  --primary-color-soft: hsla(160, 100%, 37%, .1);
  --primary-color-text: #000;
  --color-text: #fffc;
  --color-background: #111;
  --border-radius: 3px;
}

@media (prefers-color-scheme: light) {
  :root {
  --color-text: #000;
  --color-background: #fff;
  }
}

body {
  color: var(--color-text);
  background: var(--color-background);
  transition: color 0.5s, background-color 0.5s;
  margin: 0;
  display: flex;
  place-items: center;
}

#app {
  margin: 0 auto;
  font-weight: normal;
  padding: 1em;
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
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  padding: .25em .5em;
  margin: .25em 0;
  border: 0;
  border-radius: var(--border-radius);
  font-size: inherit;
}
select:not(:first-child),
input:not(:first-child),
button:not(:first-child) {
  margin-left: .25em;
}

select {
  padding: .2em;
}

a {
  text-decoration: none;
  color: var(--primary-color);
  transition: 0.4s;
}

input {
  background: var(--primary-color-soft);
  border: 0;
  color: var(--color-text);
  border: 1px solid transparent;
  border-bottom: 1px solid var(--primary-color);
  padding: .2em;
  margin: .25em 0;
  font-size: inherit;
  border-radius: var(--border-radius);
}

input[type=checkbox] {
  appearance: none;
  border: 0;
  flex: 0;
  margin: 0 5px;
  padding: 0;
}
input[type=checkbox]:nth-child(2) {
  margin: 0 0 0 auto;
}
input[type=checkbox]::after {
  content: '';
  display: inline-block;
  background: radial-gradient(#eee 65%, #888 75%);
  width: 1.25em;
  height: 1.25em;
  border: 1px solid #888;
  box-sizing: content-box;
  border-right-width: 1em;
  transition: .3s all;
  border-radius: 1em;
  vertical-align: bottom;
}
input[type=checkbox]:checked::after {
  content: '';
  display: inline-block;
  background: radial-gradient(#fff 65%, var(--primary-color) 75%);
  border: 1px solid var(--primary-color);
  border-left-width: 1em;
}
input[type=checkbox]:disabled::after {
  background: #888;
}
input[type=checkbox]:checked:disabled::after {
  background: var(--primary-color);
}

.icon {
  width: 1.6em;
  height: 1.6em;
  padding: .3em;
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  vertical-align: top;
}

@media (min-width: 1080px) {
  .icon {
    width: auto;
    background-image: none !important;
    padding: .25em .5em;
  }
  .icon::after {
    content: attr(title);
  }
}
</style>
