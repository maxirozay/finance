<script setup>
import { useUserStore } from '../stores/user'
import TheForm from '../components/TheForm.vue'
import EditIcon from '@/assets/icons/edit.svg'
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
    showEdit = !user.data.assets.length
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
      >
        <td>
          <button
            class="icon"
            :style="`background-image:url(${EditIcon})`"
            title="Edit"
            @click="itemToEdit = asset"
          />
          {{ asset.name }}
        </td>
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
        <th>Interest</th>
        <th>Cumulated interest</th>
        <th>Value</th>
        <th>Expense</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="liability in user.data.liabilities.sort((a, b) => b.valuePerYear - a.valuePerYear)"
        :key="liability.id"
      >
        <td>
          <button
            class="icon"
            :style="`background-image:url(${EditIcon})`"
            title="Edit"
            @click="itemToEdit = liability"
          />
          {{ liability.name }}
        </td>
        <td>{{ liability.type === 'loan' ? `${normalizePriceToFrequency(liability.value * liability.interest / 100)} ${liability.currency}` : '' }}</td>
        <td>{{ liability.type === 'loan' ? `${formatNumber(liability.cumulatedInterest)} ${liability.currency}` : '' }}</td>
        <td>{{ liability.type === 'loan' ? `${normalizePriceToFrequency(liability.value)} ${liability.currency}` : '' }}</td>
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

.edit,
button {
  display: none;
  margin: 0;
}

#edit-toggle:checked ~ .edit,
#edit-toggle:checked ~ * button {
  display: inherit;
}

table {
  width: 100%;
  max-width: 900px;
  border-spacing: 0;
}

tr:hover {
  background-color: var(--color-border);
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
  border-bottom: 1px solid var(--color-border);
}
td:not(:first-child) {
  text-align: right;
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
