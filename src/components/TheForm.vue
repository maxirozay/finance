<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => null
  }
})
const emit = defineEmits([
  'update:item',
  'remove',
  'save',
  'cancel'
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
        <label for="quantity">
          Asset
        </label>
        <input
          id="quantity"
          v-model="copy.quantity"
          type="number"
          required
        >
        <select v-model="copy.currency">
          <option
            v-for="currency in ['CHF']"
            :key="currency"
            :value="currency"
            required
            v-text="currency"
          />
        </select>
        <select
          v-if="copy.frequency"
          v-model="copy.frequency"
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
      <div v-if="typeof copy.interest === 'number'">
        <label for="interest">
          Yearly interest
        </label>
        <input
          id="interest"
          v-model="copy.interest"
          type="number"
        >
        %
      </div>
      <div class="actions">
        <button
          type="button"
          @click="$emit('cancel')"
        >
          Cancel
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
  padding: 2em;
}

label {
  width: 100px;
  display: inline-block;
}

.actions {
  margin-top: 1em;
  float: right;
}
</style>
