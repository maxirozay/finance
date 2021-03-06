/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-standard'
  ],
  globals: {
    $ref: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly'
  }
}
