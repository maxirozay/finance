export default {
  assets: [{
    name: 'Bank account',
    value: 100000,
    valueChange: 100000,
    valuePerYear: 100000,
    interest: 1,
    frequency: 'yearly',
    currency: 'CHF'
  },
  {
    name: 'Investments',
    value: 10000,
    valueChange: 1000,
    valuePerYear: 12000,
    interest: 5,
    frequency: 'monthly',
    currency: 'CHF'
  }],
  liabilities: [{
    name: 'Taxes',
    value: 0,
    valueChange: 24000,
    valuePerYear: 24000,
    frequency: 'yearly',
    currency: 'CHF',
    type: 'expense'
  },
  {
    name: 'Rent',
    value: 0,
    valueChange: 2000,
    valuePerYear: 24000,
    frequency: 'monthly',
    currency: 'CHF',
    type: 'expense'
  },
  {
    name: 'Loan',
    value: 100000,
    valueChange: 1000,
    valuePerYear: 12000,
    duration: 8.33,
    frequency: 'monthly',
    interest: 1,
    cumulatedInterest: 4946,
    currency: 'CHF',
    type: 'loan'
  },
  {
    name: 'Food',
    value: 0,
    valueChange: 100,
    valuePerYear: 5200,
    frequency: 'weekly',
    currency: 'CHF',
    type: 'expense'
  }],
  previsionYears: 10,
  inflation: 1,
  frequency: 'yearly'
}
