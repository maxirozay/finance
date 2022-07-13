<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <Transition name="loading">
    <div
      v-if="show"
      class="loading"
    />
  </Transition>
</template>

<style scoped>
.loading {
  --size: max(400vw, 400vh);
  --half-size: min(-200vw, -200vh);
  position: fixed;
  top: 50%;
  left: 50%;
  width: var(--size);
  height: var(--size);
  z-index: 1000;
  animation-name: loading;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  background: radial-gradient(var(--color-background) 1%, var(--primary-color) 2%, var(--color-background) 3%);
  transform: translate(var(--half-size), var(--half-size)) scale(25);
}

@keyframes loading {
  50% {
    transform: translate(var(--half-size), var(--half-size)) scale(25);
  }
  100% {
    transform: translate(var(--half-size), var(--half-size)) scale(.25);
  }
}

.loading-enter-active {
  transition: all 1s ease-in-out;
  animation: none;
  background: radial-gradient(#0000 1%, var(--primary-color) 2%, var(--color-background) 3%);
  transform: translate(var(--half-size), var(--half-size)) scale(25);
}
.loading-enter-to {
  transform: translate(var(--half-size), var(--half-size)) scale(.25);
}

.loading-leave-active {
  transition: all 1s ease-in-out;
  animation: none;
  background: radial-gradient(#0000 1%, var(--primary-color) 2%, var(--color-background) 3%);
  transform: translate(var(--half-size), var(--half-size)) scale(.25);
}
.loading-leave-to {
  transform: translate(var(--half-size), var(--half-size)) scale(25);
}
</style>
