<template>
  <div class="grow bg-base-200 flex flex-col items-center justify-start p-4 gap-6">

    <div class="flex flex-col gap-4 w-full max-w-5xl">
      <GermanCreditForm :external-error="errorMsg" @calculate="calculate" @reset="clearResults" />
      <GermanCreditResults v-if="result" :result="result" />
    </div>

    <GermanAmortizationTable v-if="result" :schedule="result.schedule" :total-paid="result.totalPaid" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GermanCreditForm from './GermanCreditForm.vue'
import GermanCreditResults from './GermanCreditResults.vue'
import GermanAmortizationTable from './GermanAmortizationTable.vue'
import { creditFormSchema } from '../schemas/creditFormSchema'

const errorMsg = ref<string>('')
const result = ref<GermanResult | null>(null)

function clearResults(): void {
  result.value = null
  errorMsg.value = ''
}

function buildSchedule(amount: number, installments: number, capitalPayment: number, r: number): AmortizationRow[] {
  const schedule: AmortizationRow[] = []
  let balance = amount

  for (let i = 1; i <= installments; i++) {
    const startBalance = balance
    const interestPayment = Math.round(startBalance * r)
    const capital = i === installments ? startBalance : capitalPayment
    const totalPayment = capital + interestPayment
    const endBalance = Math.max(0, startBalance - capital)

    schedule.push({ month: i, startBalance, interestPayment, capitalPayment: capital, adminFees: 0, totalPayment, endBalance })
    balance = endBalance
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
  const capitalPayment = Math.round(amount / installments)
  const schedule = buildSchedule(amount, installments, capitalPayment, r)

  const totalPaid = schedule.reduce((s, row) => s + row.totalPayment, 0)
  const totalInterest = totalPaid - amount

  const annualRate = (Math.pow(1 + r, 12) - 1) * 100
  const nominalRate = monthlyRate * 12
  const totalRate = (totalInterest / amount) * 100

  result.value = {
    amount,
    installments,
    capitalPayment,
    firstInstallmentAmount: schedule[0].totalPayment,
    lastInstallmentAmount: schedule[installments - 1].totalPayment,
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
