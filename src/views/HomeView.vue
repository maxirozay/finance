<script setup>
import { useUserStore } from '../stores/user'
import TheForm from '../components/TheForm.vue'
import EditIcon from '@/assets/icons/edit.svg'
import DeleteIcon from '@/assets/icons/delete.svg'

const user = useUserStore()

const itemToEdit = $ref(null)
const showEdit = !user.data.accounts.length
</script>

<template>
  <label for="edit-toggle">
    Edit
  </label>
  <input
    id="edit-toggle"
    type="checkbox"
    :checked="showEdit"
  >
  <div>
    <label>
      Main currency
      <select
        v-model="user.currency"
        @change="user.getExchangeRates"
      >
        <option
          v-for="currency in user.currencies"
          :key="currency"
          :value="currency"
          required
          v-text="currency"
        />
      </select>
    </label>
  </div>

  <h2>Accounts {{ user.totalAccounts.toLocaleString() }} {{ user.currency }}</h2>
  <h3>Interest {{ user.totalInterests.toLocaleString() }} {{ user.currency }}</h3>
  <div
    v-for="(account, i) in user.data.accounts.sort((a, b) => b.quantity - a.quantity)"
    :key="account.id"
    class="row"
  >
    <div>{{ account.name }}</div>
    <div>{{ `${account.quantity.toLocaleString()} ${account.currency} + ${account.interest.toFixed(2)}` }}%</div>
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
  <div>
    <button @click="itemToEdit = user.data.accounts[user.data.accounts.push({ name: '', quantity: 0, currency: user.currency, interest: 0 }) - 1]">
      Add an account
   </button>
  </div>

  <h2>Net incomes {{ user.totalIncomes.toLocaleString() }} {{ user.currency }}</h2>
  <div
    v-for="(income, i) in user.data.incomes.sort((a, b) => b.quantityPerYear - a.quantityPerYear)"
    :key="income.id"
    class="row"
  >
    <div>{{ income.name }}</div>
    <div>{{ `${income.quantityPerYear.toLocaleString()} ${income.currency}` }}</div>
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
  <div>
    <button @click="itemToEdit = user.data.incomes[user.data.incomes.push({ name: '', quantity: 0, currency: user.currency, frequency: 'monthly', quantityPerYear: 0 }) - 1]">
      Add an income
    </button>
  </div>

  <h2>Expenses {{ user.totalExpenses.toLocaleString() }} {{ user.currency }}</h2>
  <div
    v-for="(expense, i) in user.data.expenses.sort((a, b) => b.quantityPerYear - a.quantityPerYear)"
    :key="expense.id"
    class="row"
  >
    <div>{{ expense.name }}</div>
    <div>{{ `${expense.quantityPerYear.toLocaleString()} ${expense.currency}` }}</div>
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
      @click="itemToEdit = expense"
    />
  </div>
  <div>
    <button @click="itemToEdit = user.data.expenses[user.data.expenses.push({ name: '', quantity: 0, currency: user.currency, frequency: 'monthly', quantityPerYear: 0 }) - 1]">
      Add an expense
    </button>
  </div>

  <h2>Savings {{ (user.totalIncomes - user.totalExpenses + user.totalInterests).toLocaleString() }} {{ user.currency }}</h2>

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
    on savings: {{ user.prevision.toLocaleString() }} {{ user.currency }}
  </div>

  <div class="separator" />
  <small>All incomes, expenses and interests are displayed per year.</small>

  <TheForm
    v-model:item="itemToEdit"
    @close="itemToEdit = null"
    @save="user.save().then(() => { itemToEdit = null })"
  />
</template>

<style scoped>
h2 {
  margin-top: 1em;
}

#edit-toggle ~ div label,
button {
  display: none;
}

#edit-toggle:checked ~ div label,
#edit-toggle:checked ~ div button {
  display: inline-block;
}

.row {
  display: flex;
  align-items: center;
  text-align: right;
  border-bottom: 1px solid var(--color-border);
}
.row:hover {
  background-color: var(--color-border);
}
.row > * {
  flex: 1;
}
.row > *:first-child {
  text-align: left;
}
.row > button {
  flex: inherit;
}

.prevision {
  max-width: 3em;
}

.separator {
  width: 2em;
  height: 1px;
  background-color: var(--color-border);
  margin: 2em auto;
}
</style>
