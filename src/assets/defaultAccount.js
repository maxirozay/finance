export default {
  accounts: [{
    name: 'Main',
    quantity: 10000,
    interest: 1,
    currency: 'CHF'
  }],
  incomes: [{
    name: 'Job',
    quantity: 100000,
    quantityPerYear: 100000,
    frequency: 'yearly',
    currency: 'CHF'
  }],
  investments: [{
    name: 'ETF',
    quantity: 10000,
    quantityPerYear: 10000,
    frequency: 'yearly',
    currency: 'CHF'
  }],
  expenses: [{
    name: 'Taxes',
    quantity: 10000,
    quantityPerYear: 10000,
    frequency: 'yearly',
    currency: 'CHF'
  },
  {
    name: 'Rent',
    quantity: 20000,
    quantityPerYear: 20000,
    frequency: 'yearly',
    currency: 'CHF'
  },
  {
    name: 'Food',
    quantity: 10000,
    quantityPerYear: 10000,
    frequency: 'yearly',
    currency: 'CHF'
  }],
  previsionYears: 10,
  savingsInterest: 0,
  investmentsInterest: 5,
  inflation: 1,
  frequency: 'yearly'
}
