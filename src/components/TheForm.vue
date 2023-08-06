<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const props = defineProps({
  item: {
    type: Object,
    default: () => null
  },
  type: {
    type: String,
    default: 'account'
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
</script>

<template>
  <div
    v-if="copy"
    class="background"
    @click.self="$emit('close')"
  >
    <form @submit.prevent="$emit('save')">
      <label for="name">
        Name
      </label>
      <input
        id="name"
        v-model="copy.name"
        type="text"
        required
      >
      <div>
        <small>Put the current value (saving/loan) plus the value that will be added (income/expense) {{ copy.frequency }}</small>
      </div>
      <div>
        <label for="value">
          Value
        </label>
        <input
          id="value"
          v-model="copy.value"
          type="number"
          required
        >
        <select v-model="copy.currency">
          <option
            v-for="currency in user.currencies"
            :key="currency.id"
            :value="currency.id"
            required
            v-text="currency.id"
          />
        </select>
      </div>
      <div>
        <label for="valueChange">
          +
        </label>
        <input
          id="valueChange"
          v-model="copy.valueChange"
          type="number"
          required
        >
        <select v-model="copy.frequency">
          <option
            v-for="frequency in ['weekly', 'monthly', 'yearly']"
            :key="frequency"
            :value="frequency"
            required
            v-text="frequency"
          />
        </select>
      </div>
      <div>
        <label for="interest">
          Interests
        </label>
        <input
          id="interest"
          v-model="copy.interest"
          type="number"
          step="0.01"
        >
        %
      </div>
      <div class="actions">
        <button
          title="Delete"
          style="margin-right: auto;"
          @click="$emit('delete')"
        >
          Delete
        </button>
        <button
          type="button"
          @click="$emit('close')"
        >
          Close
        </button>
        <button type="submit">
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
  background-color: #0008;
  display: flex;
  place-items: center;
  justify-content: center;
}

form {
  max-width: 600px;
  background-color: var(--color-background);
  padding: 1em;
}

label {
  width: 70px;
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
