<script setup>
import { computed, ref } from 'vue'

const r = 100 / (2 * Math.PI)
const rOut = 2 * r
const d = 4 * r

const colors = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac', '#b77322', '#16d620', '#b91383', '#f4359e', '#9c5935', '#a9c413', '#2a778d', '#668d1c', '#bea413', '#0c5922', '#743411']

const selection = ref(0)

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
    color: colors[i % colors.length]
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
    height="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      v-for="(item, i) in stats"
      :key="i"
      :cx="rOut"
      :cy="rOut"
      :r="r"
      :stroke="selection === i ? '#fff' : item.color"
      :stroke-width="rOut"
      :stroke-dasharray="item.percentage + ', 100'"
      :style="`transform: rotate(${3.6 * item.startPercentage}deg)`"
      fill="none"
      @click="selection = i"
    >
      <title>{{ item.name }}</title>
    </circle>
  </svg>
  <div>{{ stats[selection].name }} {{ stats[selection].percentage.toFixed(1) }}%</div>
</template>

<style scoped>
svg {
  margin: .5em 0;
}

circle {
  transform-origin: center;

  > span {
    position: absolute;
  }
}
</style>
