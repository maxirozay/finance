<script setup>
import { useUserStore } from '../stores/user'

const user = useUserStore()
</script>

<template>
  <h2>Accounts {{ user.totalAccounts }} CHF</h2>
  <h4>Interest {{ user.totalInterests }} CHF</h4>
  <div
    v-for="(account, i) in user.data.accounts"
    :key="account.id"
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
  <button @click="user.data.accounts.push({ id: Date.now(), currency: 'CHF' })">
    Add an account
  </button>

  <h2>Net incomes {{ user.totalIncomes }} CHF</h2>
  <div
    v-for="(income, i) in user.data.incomes"
    :key="income.id"
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
  <button @click="user.data.incomes.push({ id: Date.now(), currency: 'CHF' })">
    Add an income
  </button>

  <h2>Outcomes {{ user.totalOutcomes }} CHF</h2>
  <div
    v-for="(outcome, i) in user.data.outcomes"
    :key="outcome.id"
  >
    <label>
      Name
      <input
        v-model="outcome.name"
        type="text"
      >
    </label>
    <div>
      <label>
        Asset
        <input
          v-model="outcome.quantity"
          type="number"
        >
      </label>
      <select v-model="outcome.currency">
        <option
          v-for="currency in ['CHF']"
          :key="currency"
          :value="currency"
          v-text="currency"
        />
      </select>
      <select v-model="outcome.frequency">
        <option
          v-for="frequency in ['weekly', 'monthly', 'yearly']"
          :key="frequency"
          :value="frequency"
          v-text="frequency"
        />
      </select>
    </div>
    <div>
      <button @click="user.data.outcome.splice(i, 1)">
        Remove
      </button>
    </div>
  </div>
  <button @click="user.data.outcomes.push({ id: Date.now(), currency: 'CHF', frequency: 'monthly' })">
    Add an outcome
  </button>

  <h2>Savings {{ user.totalIncomes - user.totalOutcomes + user.totalInterests }} CHF</h2>

  <div>
    <button @click="user.save()">
      Save
    </button>
  </div>
</template>
