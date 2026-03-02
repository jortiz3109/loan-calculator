<template>
  <div class="grow bg-base-200 flex flex-col items-center justify-start p-4 gap-6">

    <!-- Stack: form on top, results behind -->
    <div class="flex flex-col gap-4 w-full max-w-5xl">
      <FrenchCreditForm :external-error="errorMsg" @calculate="calculate" @reset="clearResults" />
      <FrenchCreditResults v-if="result" :result="result" />
    </div>

    <!-- Tabla de amortización -->
    <FrenchAmortizationTable v-if="result" :schedule="result.schedule" :total-paid="result.totalPaid"
      :show-admin-fees="result.hasAdminFees" />

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FrenchCreditForm from './FrenchCreditForm.vue'
import FrenchCreditResults from './FrenchCreditResults.vue'
import FrenchAmortizationTable from './FrenchAmortizationTable.vue'
import { creditFormSchema } from '../schemas/creditFormSchema'

const errorMsg = ref<string>('')
const result = ref<Result | null>(null)

function clearResults(): void {
  result.value = null
  errorMsg.value = ''
}

function buildSchedule(
  amount: number,
  installments: number,
  installmentAmount: number,
  theoreticalInstallment: number,
  adminFees: number,
  r: number,
): AmortizationRow[] {
  const schedule: AmortizationRow[] = []
  let balance = amount

  for (let i = 1; i <= installments; i++) {
    const startBalance = balance
    const interestPayment = startBalance * r
    const capitalPayment = i === installments
      ? startBalance
      : theoreticalInstallment - interestPayment
    const endBalance = Math.max(0, startBalance - capitalPayment)

    schedule.push({ month: i, startBalance, interestPayment, capitalPayment, adminFees, totalPayment: installmentAmount, endBalance })
    balance = endBalance
  }

  return schedule
}

function calculate(payload: {
  amount: string
  installments: string
  installmentAmount: string | undefined
  rate: string
  rateType: 'monthly' | 'annual'
}): void {
  errorMsg.value = ''
  result.value = null

  const parsed = creditFormSchema.safeParse({
    amount: payload.amount,
    installments: payload.installments,
    installmentAmount: payload.installmentAmount,
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
  const theoreticalInstallment = Math.round(
    r > 0
      ? amount * r / (1 - Math.pow(1 + r, -installments))
      : amount / installments
  )

  const installmentAmount = parsed.data.installmentAmount ?? theoreticalInstallment
  const adminFees = installmentAmount - theoreticalInstallment
  const hasAdminFees = adminFees > 0

  const totalPaid = installments * installmentAmount
  const totalInterest = totalPaid - amount

  if (totalInterest < 0) {
    errorMsg.value = 'El total a pagar no puede ser menor al monto del crédito. Verifica el valor de las cuotas.'
    return
  }

  if (adminFees < 0) {
    errorMsg.value = 'La cuota ingresada es menor a la cuota teórica calculada con la tasa de interés. Verifica los datos.'
    return
  }

  const annualRate = (Math.pow(1 + r, 12) - 1) * 100
  const nominalRate = monthlyRate * 12
  const totalRate = (totalInterest / amount) * 100
  const monthsToPayInterest = Math.ceil(totalInterest / installmentAmount)
  const schedule = buildSchedule(amount, installments, installmentAmount, theoreticalInstallment, adminFees, r)

  result.value = {
    amount, installments, installmentAmount, monthlyRate, annualRate, nominalRate,
    totalPaid, totalInterest, totalRate, monthsToPayInterest,
    adminFees, hasAdminFees, schedule,
  }
}
</script>
