<script setup>
import { useUserStore } from '../stores/user'
import TheForm from '../components/TheForm.vue'

const user = useUserStore()

const itemToEdit = $ref(null)
</script>

<template>
  <label for="edit-toggle">
    Edit
  </label>
  <input
    id="edit-toggle"
    type="checkbox"
  >
  <h2>Accounts {{ user.totalAccounts.toLocaleString() }} CHF</h2>
  <h3>Interest {{ user.totalInterests.toLocaleString() }} CHF</h3>
  <div
    v-for="(account, i) in user.data.accounts"
    :key="account.id"
    class="row"
  >
    {{ `${account.name} ${account.quantity}${account.currency} ${account.interest}%` }}
    <button @click="user.data.accounts.splice(i, 1);user.save()">
      Delete
    </button>
    <button @click="itemToEdit = account">
      Edit
    </button>
  </div>
  <div>
    <button @click="itemToEdit = user.data.accounts[user.data.accounts.push({ name: '', quantity: 0, currency: 'CHF', interest: 0 }) - 1]">
      Add an account
    </button>
  </div>

  <h2>Net incomes {{ user.totalIncomes.toLocaleString() }} CHF</h2>
  <div
    v-for="(income, i) in user.data.incomes"
    :key="income.id"
    class="row"
  >
    {{ `${income.name} ${income.quantity}${income.currency} ${income.frequency}` }}
    <button @click="user.data.incomes.splice(i, 1);user.save()">
      Delete
    </button>
    <button @click="itemToEdit = income">
      Edit
    </button>
  </div>
  <div>
    <button @click="itemToEdit = user.data.incomes[user.data.incomes.push({ name: '', quantity: 0, currency: 'CHF', frequency: 'monthly' }) - 1]">
      Add an income
    </button>
  </div>

  <h2>Expenses {{ user.totalExpenses.toLocaleString() }} CHF</h2>
  <div
    v-for="(expense, i) in user.data.expenses"
    :key="expense.id"
    class="row"
  >
    {{ `${expense.name} ${expense.quantity}${expense.currency} ${expense.frequency}` }}
    <button @click="user.data.expenses.splice(i, 1);user.save()">
      Delete
    </button>
    <button @click="itemToEdit = expense">
      Edit
    </button>
  </div>
  <div>
    <button @click="itemToEdit = user.data.expenses[user.data.expenses.push({ name: '', quantity: 0, currency: 'CHF', frequency: 'monthly' }) - 1]">
      Add an expense
    </button>
  </div>

  <h2>Savings {{ (user.totalIncomes - user.totalExpenses + user.totalInterests).toLocaleString() }} CHF</h2>

  <div>
    Prevision in
    <label>
      <input
        v-model="user.data.previsionYears"
        class="prevision"
        type="number"
        min="0"
        max="99"
      >
      year(s)
    </label>
    with an interest of
    <label>
      <input
        v-model="user.data.savingsInterest"
        class="prevision"
        type="number"
        min="0"
        max="99"
        step="0.01"
      >
      %
    </label>
    on savings: {{ user.prevision.toFixed(0).toLocaleString() }} CHF
  </div>

  <TheForm
    v-model:item="itemToEdit"
    @cancel="itemToEdit = null"
    @save="user.save().then(() => { itemToEdit = null })"
  />
</template>

<style scoped>
button {
  opacity: 0;
}
button:first-of-type {
  margin-left: auto;
}

#edit-toggle:checked ~ div button {
  opacity: 1;
}

.row {
  display: flex;
  align-items: center;
}

.prevision {
  max-width: 3em;
}
</style>
