<script setup>
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth'
let email = $ref('')
let error = $ref('')
let emailSent = $ref(false)
function signIn () {
  error = null
  email = email.toLowerCase().trim()
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true
  }
  sendSignInLinkToEmail(getAuth(), email, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email)
      emailSent = true
    })
    .catch((error) => {
      error = error.message
    })
}
</script>

<template>
  <form @submit.prevent="signIn">
    <label for="email">Email</label>
    <input
      id="email"
      v-model="email"
      type="email"
      required
    >
    <small>
      By signing in you agree to our
      <a
        href="https://prealyse.com/terms"
        target="_blank"
      >
        terms and conditions.
      </a>
    </small>
    <p v-if="emailSent">
      Check your mailbox
    </p>
    <button v-else>
      Sign in
    </button>
    <p
      v-if="error"
      class="error"
      v-text="error"
    />
  </form>
</template>

<style lang="css" scoped>
form {
  max-width: 300px;
  margin: auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
}

button {
  margin-left: 0;
}
.error {
  color: red;
}
</style>
