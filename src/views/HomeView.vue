<script setup>
import { useUserStore } from '../stores/user'

const user = useUserStore()
</script>

<template>
  <h2>Accounts</h2>
  <div
    v-for="(account, i) in user.data.accounts"
    :key="account.name"
  >
    <label>
      Name
      <input
        v-model="account.name"
        type="text"
      >
    </label>
    <div>
      <label>
        Asset
        <input
          v-model="account.quantity"
          type="number"
        >
      </label>
      <select v-model="account.currency">
        <option
          v-for="currency in ['CHF']"
          :key="currency"
          :value="currency"
          v-text="currency"
        />
      </select>
    </div>
    <label>
      Yearly interest
      <input
        v-model="account.interest"
        type="number"
      >
      %
    </label>
    <div>
      <button @click="user.data.accounts.splice(i, 1)">
        Remove
      </button>
    </div>
  </div>
  <button @click="user.data.accounts.push({ currency: 'CHF' })">
    Add an account
  </button>

  <h2>Net incomes</h2>
  <div
    v-for="(income, i) in user.data.incomes"
    :key="income.name"
  >
    <label>
      Name
      <input
        v-model="income.name"
        type="text"
      >
    </label>
    <div>
      <label>
        Asset
        <input
          v-model="income.quantity"
          type="number"
        >
      </label>
      <select v-model="income.currency">
        <option
          v-for="currency in ['CHF']"
          :key="currency"
          :value="currency"
          v-text="currency"
        />
      </select>
    </div>
    <div>
      <button @click="user.data.incomes.splice(i, 1)">
        Remove
      </button>
    </div>
  </div>
  <button @click="user.data.incomes.push({ currency: 'CHF' })">
    Add an income
  </button>
</template>
