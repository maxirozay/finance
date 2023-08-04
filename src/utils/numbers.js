export {
  formatNumber
}

function formatNumber (number) {
  if (!number) return 0
  let digits = 0
  let unit = ''
  let absNumber = Math.abs(number)
  if (absNumber >= 10000000) {
    absNumber /= 1000000
    unit = 'M'
  } else if (absNumber >= 10000) {
    absNumber /= 1000
    unit = 'K'
  }
  digits = 5 - absNumber.toFixed(0).length - unit.length
  if (absNumber > 1000) digits--
  else if (absNumber < 0.0001) digits = 8
  digits = Math.max(digits, 0)
  if (number < 0) {
    digits--
    absNumber *= -1
  }
  return absNumber.toLocaleString('en-US', { maximumFractionDigits: Math.abs(digits) }) + unit
}
