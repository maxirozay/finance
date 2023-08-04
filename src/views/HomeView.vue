<script setup>
import { useUserStore } from '../stores/user'
import TheForm from '../components/TheForm.vue'
import EditIcon from '@/assets/icons/edit.svg'
import DeleteIcon from '@/assets/icons/delete.svg'
import { watch } from 'vue'
import { formatNumber } from '@/utils/numbers'

const user = useUserStore()

const itemToEdit = $ref(null)
let showEdit = $ref(true)
const frequencies = [
  'yearly',
  'monthly',
  'weekly',
  'daily'
]

watch(() => user.id, (newId) => {
  if (user.id) {
    showEdit = !user.data.accounts.length
  }
})

const normalizePriceToFrequency = (number) => {
  return formatNumber(number / user.getFrequencyMultiplier(user.data.frequency))
}
</script>

<template>
  <div
    v-if="!user.id"
    class="signin"
  >
    <h1>Finance management</h1>
    <p>Setup your finances to have a clear view of what you're doing with your money and where it will take you.</p>
    <br>
    <RouterLink to="signIn">
      Sign in to save your data
    </RouterLink>
  </div>
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
      Frequency
      <select v-model="user.data.frequency">
        <option
          v-for="freq in frequencies"
          :key="freq"
          :value="freq"
          v-text="freq"
        />
      </select>
    </label>
  </div>
  <div class="edit">
    <label>
      Main currency
      <select v-model="user.currency">
        <option
          v-for="currency in user.currencies"
          :key="currency.id"
          :value="currency.id"
          required
          v-text="`${currency.id} - ${currency.name}`"
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
    <div>{{ account.name }} ({{ account.interest }}%)</div>
    <div>{{ `${formatNumber(account.quantity)} ${account.currency}` }}</div>
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

  <h2>Net incomes {{ normalizePriceToFrequency(user.totalIncomes) }} {{ user.currency }}</h2>
  <div
    v-for="(income, i) in user.data.incomes.sort((a, b) => b.quantityPerYear - a.quantityPerYear)"
    :key="income.id"
    class="row"
  >
    <div>{{ income.name }}</div>
    <div>{{ `${normalizePriceToFrequency(income.quantityPerYear)} ${income.currency}` }}</div>
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

  <h2>Investments {{ normalizePriceToFrequency(user.totalInvestments) }} {{ user.currency }}</h2>
  <div
    v-for="(investment, i) in user.data.investments.sort((a, b) => b.quantityPerYear - a.quantityPerYear)"
    :key="investment.id"
    class="row"
  >
    <div>{{ investment.name }}</div>
    <div>{{ `${normalizePriceToFrequency(investment.quantityPerYear)} ${investment.currency}` }}</div>
    <button
      class="icon"
      :style="`background-image:url(${DeleteIcon})`"
      title="Delete"
      @click="user.data.investments.splice(i, 1);user.save()"
    />
    <button
      class="icon"
      :style="`background-image:url(${EditIcon})`"
      title="Edit"
      @click="itemToEdit = investment"
    />
  </div>
  <div>
    <button @click="itemToEdit = user.data.investments[user.data.investments.push({ name: '', quantity: 0, currency: user.currency, frequency: 'monthly', quantityPerYear: 0 }) - 1]">
      Add an investment
    </button>
  </div>

  <h2>Expenses {{ normalizePriceToFrequency(user.totalExpenses) }} {{ user.currency }}</h2>
  <div
    v-for="(expense, i) in user.data.expenses.sort((a, b) => b.quantityPerYear - a.quantityPerYear)"
    :key="expense.id"
    class="row"
  >
    <div>{{ expense.name }}</div>
    <div>{{ `${normalizePriceToFrequency(expense.quantityPerYear)} ${expense.currency}` }}</div>
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

  <h2>Savings {{ normalizePriceToFrequency(user.totalIncomes - user.totalExpenses - user.totalInvestments + user.totalInterests) }} {{ user.currency }}</h2>

  <h2>Prevision</h2>
  <div>
    In
    <label>
      <input
        v-model="user.data.previsionYears"
        class="prevision"
        type="number"
        min="0"
        max="99"
        @change="user.updatePrevisionSettings"
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
        @change="user.updatePrevisionSettings"
      >
      %
    </label>
    on savings and
    <label>
      <input
        v-model="user.data.investmentsInterest"
        class="prevision"
        type="number"
        min="0"
        max="99"
        @change="user.updatePrevisionSettings"
      >
      %
    </label>
    on investments, with an inflation of
    <label>
      <input
        v-model="user.data.inflation"
        class="prevision"
        type="number"
        min="-99"
        max="99"
        @change="user.updatePrevisionSettings"
      >
      %
    </label>
    .
  </div>
  <p>You get {{ formatNumber(user.prevision.worth) }} {{ user.currency }} ({{ formatNumber(user.prevision.worth * user.prevision.inflation) }} {{ user.currency }} with inflation)</p>
  Interests per year {{ formatNumber(user.prevision.interests) }} {{ user.currency }} ({{ formatNumber(user.prevision.interests * user.prevision.inflation) }} {{ user.currency }} with inflation)
  <ul>
    <li>Savings {{ formatNumber(user.prevision.savingsInterests) }} {{ user.currency }}</li>
    <li>Investments {{ formatNumber(user.prevision.investmentsInterests) }} {{ user.currency }}</li>
  </ul>

  <div class="separator" />

  <TheForm
    v-model:item="itemToEdit"
    @close="itemToEdit = null"
    @save="user.save().then(() => { itemToEdit = null })"
  />
</template>

<style scoped>
.signin {
  margin-bottom: 2em;
  text-align: center;
}

h2 {
  margin-top: 1em;
}

.edit,
button {
  display: none;
}

#edit-toggle:checked ~ .edit,
#edit-toggle:checked ~ div button {
  display: inherit;
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
