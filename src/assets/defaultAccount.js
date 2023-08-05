export default {
  assets: [{
    name: 'Bank account',
    quantity: 100000,
    quantityChange: 100000,
    quantityPerYear: 100000,
    interest: 1,
    frequency: 'yearly',
    currency: 'CHF'
  },
  {
    name: 'Investments',
    quantity: 10000,
    quantityChange: 1000,
    quantityPerYear: 12000,
    interest: 5,
    frequency: 'monthly',
    currency: 'CHF'
  }],
  liabilities: [{
    name: 'Taxes',
    quantity: 0,
    quantityChange: 10000,
    quantityPerYear: 10000,
    frequency: 'yearly',
    interest: 0,
    currency: 'CHF'
  },
  {
    name: 'Rent',
    quantity: 0,
    quantityChange: 2000,
    quantityPerYear: 24000,
    frequency: 'monthly',
    interest: 0,
    currency: 'CHF'
  },
  {
    name: 'Food',
    quantity: 0,
    quantityChange: 100,
    quantityPerYear: 5200,
    frequency: 'weekly',
    interest: 0,
    currency: 'CHF'
  }],
  previsionYears: 10,
  inflation: 1,
  frequency: 'yearly'
}
