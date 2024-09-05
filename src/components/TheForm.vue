<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import { formatNumber } from '@/utils/numbers'

const user = useUserStore()
const maxDuration = 1000

const props = defineProps({
  item: {
    type: Object,
    default: () => null
  }
})
const emit = defineEmits([
  'update:item',
  'save',
  'close',
  'delete'
])

const copy = computed({
  get () {
    return props.item
  },
  set (value) {
    emit('update:item', value)
  }
})

function updateItem () {
  copy.value.interest = Math.min(copy.value.interest, 20)
  copy.value.valuePerYear = copy.value.valueChange * user.getFrequencyMultiplier(copy.value.frequency)
  if (copy.value.type === 'loan' && copy.value.valuePerYear) {
    let paid = 0
    let value = copy.value.value
    copy.value.duration = 0
    const interestPercentage = copy.value.interest / 100
    while (paid < value && copy.value.duration < maxDuration) {
      value += (value - paid) * interestPercentage
      paid += copy.value.valuePerYear
      copy.value.duration++
    }
    if (paid > value) {
      copy.value.duration -= (paid - value) / copy.value.valuePerYear
    }
    copy.value.cumulatedInterest = value - copy.value.value
    if (copy.value.value && copy.value.valuePerYear > copy.value.value) {
      copy.value.valuePerYear = copy.value.value
    }
  }
}
</script>

<template>
  <div
    v-if="copy"
    class="background"
    @click.self="$emit('close')"
  >
    <form @submit.prevent>
      <label for="name">
        Name
      </label>
      <input
        id="name"
        v-model="copy.name"
        type="text"
        required
      >
      <div v-if="copy.type">
        <label for="type">
          Type
        </label>
        <select
          id="type"
          v-model="copy.type"
        >
          <option
            v-for="t in ['expense', 'loan']"
            :key="t"
            :value="t"
            required
            v-text="t"
          />
        </select>
      </div>
      <div>
        <label for="currency">
          Currency
        </label>
        <select
          id="currency"
          v-model="copy.currency"
        >
          <option
            v-for="currency in user.currencies"
            :key="currency.id"
            :value="currency.id"
            required
            v-text="currency.id"
          />
        </select>
      </div>
      <div v-if="!copy.type || copy.type === 'loan'">
        <label for="value">
          Value
        </label>
        <input
          id="value"
          v-model="copy.value"
          type="number"
          required
          @change="updateItem"
        >
      </div>
      <div>
        <label for="valueChange">
          {{ copy.type ? 'Payment' : 'Income added' }}
        </label>
        <input
          id="valueChange"
          v-model="copy.valueChange"
          type="number"
          required
          @change="updateItem"
        >
        <select
          v-model="copy.frequency"
          @change="updateItem"
        >
          <option
            v-for="frequency in ['weekly', 'monthly', 'yearly']"
            :key="frequency"
            :value="frequency"
            required
            v-text="frequency"
          />
        </select>
      </div>
      <div v-if="copy.type !== 'expense'">
        <label for="interest">
          Interests
        </label>
        <input
          id="interest"
          v-model="copy.interest"
          type="number"
          step="0.01"
          max="20"
          @change="updateItem"
        >
        %
      </div>
      <div v-if="copy.type === 'loan' && copy.duration">
        <div v-text="'Cumulated interest ' + formatNumber(copy.cumulatedInterest)"/>
        Paid in {{ copy.duration === maxDuration ? '+' : '' }}{{ copy.duration > 1 ? copy.duration.toFixed(0) + ' years' : Math.round(copy.duration * 12) + ' months' }}.
      </div>
      <div class="actions">
        <button
          title="Delete"
          style="margin-right: auto;"
          type="button"
          @click="$emit('delete')"
        >
          Delete
        </button>
        <button
          type="button"
          @click="updateItem();$emit('close')"
        >
          Close
        </button>
        <button
          type="button"
          @click="updateItem();$emit('save')"
        >
          Save
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #8883;
  display: flex;
  place-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

form {
  max-width: 600px;
  background-color: var(--color-background);
  padding: 1em;
}

label {
  width: 120px;
  display: inline-block;
}

input[type=number] {
  width: 100px;
}

.actions {
  margin-top: 1em;
  display: flex;
}
</style>
