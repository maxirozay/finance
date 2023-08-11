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

  <table>
    <thead>
      <tr>
        <th>Asset</th>
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
        <td>{{ asset.name }} ({{ asset.currency }})</td>
        <td>{{ normalizePriceToFrequency(asset.value * asset.interest / 100) }}</td>
        <td>{{ formatNumber(asset.value) }}</td>
        <td>{{ normalizePriceToFrequency(asset.valuePerYear) }}</td>
      </tr>
      <tr class="total">
        <td>Total ({{ user.currency }})</td>
        <td>{{ normalizePriceToFrequency(user.summary.assets.interests) }}</td>
        <td>{{ formatNumber(user.summary.assets.value) }}</td>
        <td>{{ normalizePriceToFrequency(user.summary.assets.valuePerYear) }}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <button @click="itemToEdit = user.data.assets[user.data.assets.push({ name: '', value: 0, valueChange: 0, currency: user.currency, frequency: 'monthly', valuePerYear: 0, interest: 0 }) - 1]">
      Add an asset
    </button>
  </div>

  <table>
    <thead>
      <tr>
        <th>Liability</th>
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
        <td>{{ liability.name }} ({{ liability.currency }})</td>
        <template v-if="liability.type === 'loan'">
          <td>{{ formatNumber(liability.cumulatedInterest) }}</td>
          <td>{{ normalizePriceToFrequency(liability.value * liability.interest / 100) }}</td>
          <td>{{ formatNumber(liability.value) }}</td>
        </template>
        <td
          v-else
          colspan="3"
        />
        <td>{{ normalizePriceToFrequency(liability.valuePerYear) }}</td>
      </tr>
      <tr class="total">
        <td>Total ({{ user.currency }})</td>
        <td>{{ formatNumber(user.data.liabilities.reduce((a, l) => a + (l.cumulatedInterest || 0), 0)) }}</td>
        <td>{{ normalizePriceToFrequency(user.summary.liabilities.interests) }}</td>
        <td>{{ formatNumber(user.summary.liabilities.value) }}</td>
        <td>{{ normalizePriceToFrequency(user.summary.liabilities.valuePerYear) }}</td>
      </tr>
    </tbody>
  </table>
  <div>
    <button @click="itemToEdit = user.data.liabilities[user.data.liabilities.push({ name: '', value: 0, valueChange: 0, currency: user.currency, frequency: 'monthly', valuePerYear: 0, type: 'expense' }) - 1]">
      Add a liability
    </button>
  </div>

  <h3>Savings {{ normalizePriceToFrequency(user.summary.assets.valuePerYear - user.summary.liabilities.valuePerYear) }} {{ user.currency }}</h3>

  <h3>Prevision</h3>
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
  width: 5em;
  text-align: right;
}
td {
  border-top: 1px solid #8884;
  cursor: pointer;
}
td:not(:first-child) {
  text-align: right;
  white-space: nowrap;
}

.total > td {
  font-weight: bold;
  cursor: auto;
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
