<script setup>
import { computed } from 'vue'

const r = 100 / (2 * Math.PI)
const rOut = 2 * r
const d = 4 * r

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const stats = computed(() => {
  if (!props.data) return
  const total = props.data.reduce((acc, item) => acc + item.valuePerYear, 0)
  const chart = props.data.map((d, i) => ({
    name: d.name,
    value: d.valuePerYear,
    percentage: d.valuePerYear / total * 100,
    color: `hsl(${i % 2 * 180 + Math.random() * 180}, 50%, 50%)`
  }))
  chart.sort((a, b) => b.value - a.value)
  let startPercentage = -25
  chart.forEach(item => {
    item.startPercentage = startPercentage
    startPercentage += item.percentage
  })
  return chart
})
</script>

<template>
  <svg
    v-if="data"
    :viewBox="`0 0 ${d} ${d}`"
    height="50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      v-for="(item, i) in stats"
      :key="i"
      :cx="rOut"
      :cy="rOut"
      :r="r"
      :stroke="item.color"
      :stroke-width="rOut"
      :stroke-dasharray="item.percentage + ', 100'"
      :style="`transform: rotate(${3.6 * item.startPercentage}deg)`"
      fill="none"
    >
      <title>{{ item.name }}</title>
    </circle>
  </svg>
</template>

<style scoped>
svg {
  margin: .5em 0;
}

circle {
  transform-origin: center;
}
</style>
