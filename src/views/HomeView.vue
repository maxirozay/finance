<script setup>
import { useUserStore } from '../stores/user'
import TheForm from '../components/TheForm.vue'
import EditIcon from '@/assets/icons/edit.svg'
import DeleteIcon from '@/assets/icons/delete.svg'

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
    v-for="(account, i) in user.data.accounts.sort((a, b) => b.quantity - a.quantity)"
    :key="account.id"
    class="row"
  >
    <div>{{ account.name }}</div>
    <div>{{ `${account.quantity.toLocaleString()} ${account.currency}` }}</div>
    <div>{{ account.interest }}%</div>
    <div>
      <button
        class="icon"
        :style="`background-image:url(${DeleteIcon})`"
        title="Delete"
        @click="user.data.accounts.splice(i, 1);user.save()"
      />
      <button
        class="icon"
        :style="`background-image:url(${EditIcon})`"
        title="Edit"
        @click="itemToEdit = account"
      />
    </div>
  </div>
  <div>
    <button @click="itemToEdit = user.data.accounts[user.data.accounts.push({ name: '', quantity: 0, currency: 'CHF', interest: 0 }) - 1]">
      Add an account
    </button>
  </div>

  <h2>Net incomes {{ user.totalIncomes.toLocaleString() }} CHF</h2>
  <div
    v-for="(income, i) in user.data.incomes.sort((a, b) => b.quantity - a.quantity)"
    :key="income.id"
    class="row"
  >
    <div>{{ income.name }}</div>
    <div>{{ `${income.quantity.toLocaleString()} ${income.currency}` }}</div>
    <div>{{ income.frequency }}</div>
    <div>
      <button
        class="icon"
        :style="`background-image:url(${DeleteIcon})`"
        title="Delete"
        @click="user.data.incomes.splice(i, 1);user.save()"
      />
      <button
        class="icon"
        :style="`background-image:url(${EditIcon})`"
        title="Edit"
        @click="itemToEdit = income"
      />
    </div>
  </div>
  <div>
    <button @click="itemToEdit = user.data.incomes[user.data.incomes.push({ name: '', quantity: 0, currency: 'CHF', frequency: 'monthly' }) - 1]">
      Add an income
    </button>
  </div>

  <h2>Expenses {{ user.totalExpenses.toLocaleString() }} CHF</h2>
  <div
    v-for="(expense, i) in user.data.expenses.sort((a, b) => b.quantity - a.quantity)"
    :key="expense.id"
    class="row"
  >
    <div>{{ expense.name }}</div>
    <div>{{ `${expense.quantity.toLocaleString()} ${expense.currency}` }}</div>
    <div>{{ expense.frequency }}</div>
    <div>
      <button
        class="icon"
        :style="`background-image:url(${DeleteIcon})`"
        title="Delete"
        @click="user.data.expenses.splice(i, 1);user.save()"
      />
      <button
        class="icon"
        :style="`background-image:url(${EditIcon})`"
        title="Edit"
        @click="itemToEdit = income"
      />
    </div>
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
    on savings: {{ user.prevision.toLocaleString() }} CHF
  </div>

  <TheForm
    v-model:item="itemToEdit"
    @cancel="itemToEdit = null"
    @save="user.save().then(() => { itemToEdit = null })"
  />
</template>

<style scoped>
h2 {
  margin-top: 1em;
}

button {
  display: none;
}

#edit-toggle:checked ~ div button {
  display: inline-block;
}

.row {
  display: flex;
  align-items: center;
}
.row > * {
  flex: 1;
}
.row > *:last-child {
  flex: 0;
  white-space: nowrap;
}

.prevision {
  max-width: 3em;
}
</style>
