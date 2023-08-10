<script setup>
import { useUserStore } from '../stores/user'
import TheForm from '../components/TheForm.vue'
import { formatNumber } from '@/utils/numbers'

const user = useUserStore()

const itemToEdit = $ref(null)
const frequencies = [
  'yearly',
  'monthly',
  'weekly',
  'daily'
]

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
  <div>
    <label>
      Incomes/Expenses/Interests frequency
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
  <div>
    <label>
      Main currency
      <select
        v-model="user.currency"
        @change="user.getExchangeRates()"
      >
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

  <h2>Assets {{ formatNumber(user.summary.assets.value) }} {{ user.currency }}</h2>
  <h3>Incomes {{ normalizePriceToFrequency(user.summary.assets.valuePerYear) }} {{ user.currency }}</h3>
  <h3>Interest {{ normalizePriceToFrequency(user.summary.assets.interests) }} {{ user.currency }}</h3>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Interest</th>
        <th>Value</th>
        <th>Income</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="asset in user.data.assets.sort((a, b) => b.value - a.value)"
        :key="asset.id"
        @click="itemToEdit = asset"
      >
        <td>{{ asset.name }}</td>
        <td>{{ `${normalizePriceToFrequency(asset.value * asset.interest / 100)} ${asset.currency}` }}</td>
        <td>{{ `${formatNumber(asset.value)} ${asset.currency}` }}</td>
        <td>{{ `${normalizePriceToFrequency(asset.valuePerYear)} ${asset.currency}` }}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <button @click="itemToEdit = user.data.assets[user.data.assets.push({ name: '', value: 0, valueChange: 0, currency: user.currency, frequency: 'monthly', valuePerYear: 0, interest: 0 }) - 1]">
      Add an asset
    </button>
  </div>

  <h2>Liabilities {{ formatNumber(user.summary.liabilities.value) }} {{ user.currency }}</h2>
  <h3>Expenses {{ normalizePriceToFrequency(user.summary.liabilities.valuePerYear) }} {{ user.currency }}</h3>
  <h3>Interests {{ normalizePriceToFrequency(user.summary.liabilities.interests) }} {{ user.currency }}</h3>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Cumulated interest</th>
        <th>Interest</th>
        <th>Value</th>
        <th>Expense</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="liability in user.data.liabilities.sort((a, b) => b.valuePerYear - a.valuePerYear)"
        :key="liability.id"
        @click="itemToEdit = liability"
      >
        <td>{{ liability.name }}</td>
        <template v-if="liability.type === 'loan'">
          <td>{{ `${formatNumber(liability.cumulatedInterest)} ${liability.currency}` }}</td>
          <td>{{ `${normalizePriceToFrequency(liability.value * liability.interest / 100)} ${liability.currency}` }}</td>
          <td>{{ `${formatNumber(liability.value)} ${liability.currency}` }}</td>
        </template>
        <td
          v-else
          colspan="3"
        />
        <td>{{ `${normalizePriceToFrequency(liability.valuePerYear)} ${liability.currency}` }}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <button @click="itemToEdit = user.data.liabilities[user.data.liabilities.push({ name: '', value: 0, valueChange: 0, currency: user.currency, frequency: 'monthly', valuePerYear: 0, type: 'expense' }) - 1]">
      Add a liability
    </button>
  </div>

  <h2>Savings {{ normalizePriceToFrequency(user.summary.assets.valuePerYear - user.summary.liabilities.valuePerYear) }} {{ user.currency }}</h2>

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
    with an inflation of
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
  <ul>
    <li>Worth {{ formatNumber(user.prevision.worth) }} {{ user.currency }} ({{ formatNumber(user.prevision.worth * user.prevision.inflation) }} {{ user.currency }} with inflation)</li>
    <li>Interests {{ formatNumber(user.prevision.interests) }} {{ user.currency }} ({{ formatNumber(user.prevision.interests * user.prevision.inflation) }} {{ user.currency }} with inflation)</li>
  </ul>
  <div class="separator" />

  <div style="text-align: center;">
    <a
      href="https://trader.prealyse.com"
      target="_blank"
    >
      Trade
    </a>
    and
    <a
      href="https://prealyse.com"
      target="_blank"
    >
      analyse
    </a>
    cryptos prices to help your finances.
  </div>

  <TheForm
    v-model:item="itemToEdit"
    @close="itemToEdit = null"
    @delete="user.data.assets = user.data.assets.filter(i => i.name !== itemToEdit.name);user.data.liabilities = user.data.liabilities.filter(i => i.name !== itemToEdit.name);itemToEdit = null"
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

table {
  width: 100%;
  max-width: 900px;
  border-spacing: 0;
}

tr:hover {
  background-color: #8884;
}
th {
  text-align: left;
  font-weight: bold;
  font-size: small;
}
th:not(:first-child) {
  width: 6em;
  text-align: right;
}
td {
  border-bottom: 1px solid #8884;
  cursor: pointer;
}
td:not(:first-child) {
  text-align: right;
  white-space: nowrap;
}
.prevision {
  max-width: 3em;
}

.separator {
  width: 2em;
  height: 1px;
  background-color: #8884;
  margin: 2em auto;
}
</style>
