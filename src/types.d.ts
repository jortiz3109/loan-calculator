interface AmortizationRow {
  month: number
  startBalance: number
  interestPayment: number
  capitalPayment: number
  adminFees: number
  totalPayment: number
  endBalance: number
}

interface Result {
  amount: number
  installments: number
  installmentAmount: number
  monthlyRate: number
  annualRate: number
  nominalRate: number
  totalPaid: number
  totalInterest: number
  totalRate: number
  monthsToPayInterest: number
  adminFees: number
  hasAdminFees: boolean
  schedule: AmortizationRow[]
}
