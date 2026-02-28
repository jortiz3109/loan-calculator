<template>
  <div class="grow bg-base-200 flex flex-col items-center justify-start p-4 gap-6">

    <div class="flex flex-col gap-4 w-full max-w-5xl">
      <AmericanCreditForm :external-error="errorMsg" @calculate="calculate" @reset="clearResults" />
      <AmericanCreditResults v-if="result" :result="result" />
    </div>

    <AmericanAmortizationTable v-if="result" :schedule="result.schedule" :total-paid="result.totalPaid" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AmericanCreditForm from './AmericanCreditForm.vue'
import AmericanCreditResults from './AmericanCreditResults.vue'
import AmericanAmortizationTable from './AmericanAmortizationTable.vue'
import { creditFormSchema } from '../schemas/creditFormSchema'

const errorMsg = ref<string>('')
const result = ref<AmericanResult | null>(null)

function clearResults(): void {
  result.value = null
  errorMsg.value = ''
}

function buildSchedule(amount: number, installments: number, r: number): AmortizationRow[] {
  const schedule: AmortizationRow[] = []

  for (let i = 1; i <= installments; i++) {
    const isLast = i === installments
    const startBalance = amount
    const interestPayment = amount * r
    const capitalPayment = isLast ? amount : 0
    const totalPayment = isLast ? amount * r + amount : amount * r
    const endBalance = isLast ? 0 : amount

    schedule.push({ month: i, startBalance, interestPayment, capitalPayment, adminFees: 0, totalPayment, endBalance })
  }

  return schedule
}

function calculate(payload: {
  amount: string
  installments: string
  rate: string
  rateType: 'monthly' | 'annual'
}): void {
  errorMsg.value = ''
  result.value = null

  const parsed = creditFormSchema.safeParse({
    amount: payload.amount,
    installments: payload.installments,
    rate: payload.rate,
  })

  if (!parsed.success) {
    errorMsg.value = parsed.error.issues[0].message
    return
  }

  const { amount, installments, rate } = parsed.data

  const monthlyRate = payload.rateType === 'annual'
    ? ((1 + rate / 100) ** (1 / 12) - 1) * 100
    : rate

  const r = monthlyRate / 100

  if (r === 0) {
    errorMsg.value = 'El sistema americano requiere una tasa de interés mayor a cero.'
    return
  }

  const periodicInterestPayment = Math.round(amount * r)
  const lastInstallmentAmount = Math.round(amount * r + amount)
  const totalPaid = (installments - 1) * periodicInterestPayment + lastInstallmentAmount
  const totalInterest = totalPaid - amount

  const annualRate = (Math.pow(1 + r, 12) - 1) * 100
  const nominalRate = monthlyRate * 12
  const totalRate = (totalInterest / amount) * 100
  const schedule = buildSchedule(amount, installments, r)

  result.value = {
    amount,
    installments,
    periodicInterestPayment,
    lastInstallmentAmount,
    monthlyRate,
    annualRate,
    nominalRate,
    totalPaid,
    totalInterest,
    totalRate,
    schedule,
  }
}
</script>
