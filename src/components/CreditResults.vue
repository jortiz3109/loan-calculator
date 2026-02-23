<template>
  <div class="card bg-base-100 shadow-xl w-full">
    <div class="card-body">
      <h2 class="card-title text-xl font-bold mb-2">Resultados</h2>

      <div class="stats stats-vertical shadow w-full">
        <div class="stat">
          <div class="stat-title">Total a pagar</div>
          <div class="stat-value text-primary text-xl">{{ formatCOP(result.totalPaid) }}</div>
          <div class="stat-desc">{{ result.installments }} cuotas de {{ formatCOP(result.installmentAmount) }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Interés total</div>
          <div class="stat-value text-warning text-xl">{{ formatCOP(result.totalInterest) }}</div>
          <div class="stat-desc">Sobre un crédito de {{ formatCOP(result.amount) }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Tasa mensual</div>
          <div class="stat-value text-xl">{{ result.monthlyRate.toFixed(2) }}%</div>
          <div class="stat-desc">Tasa efectiva mensual (TEM)</div>
        </div>

        <div class="stat">
          <div class="stat-title">Tasa anual</div>
          <div class="stat-value text-xl">{{ result.annualRate.toFixed(2) }}%</div>
          <div class="stat-desc">Tasa efectiva anual (TEA)</div>
        </div>

        <div class="stat">
          <div class="stat-title">Tasa nominal anual</div>
          <div class="stat-value text-xl">{{ result.nominalRate.toFixed(2) }}%</div>
          <div class="stat-desc">Tasa nominal anual (TNA)</div>
        </div>

        <div class="stat">
          <div class="stat-title">Tasa total</div>
          <div class="stat-value text-xl">{{ result.totalRate.toFixed(2) }}%</div>
          <div class="stat-desc flex items-center gap-2">
            Nivel de costo:
            <span :class="badgeClass">{{ costLevel }}</span>
          </div>
        </div>

        <div class="stat">
          <div class="stat-title">Meses para pagar intereses</div>
          <div class="stat-value text-xl">{{ result.monthsToPayInterest }}</div>
          <div class="stat-desc">Cuotas equivalentes al interés total</div>
        </div>
      </div>

      <DisclaimerBanner class="mt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrencyFormat } from '../composables/useCurrencyFormat'
import DisclaimerBanner from './DisclaimerBanner.vue'

const props = defineProps<{
  result: Result
}>()

const { formatCOP } = useCurrencyFormat()

const costLevel = computed<string>(() => {
  const t = props.result.totalRate
  if (t < 20) return 'Bajo'
  if (t < 50) return 'Moderado'
  return 'Alto'
})

const badgeClass = computed<string>(() => {
  const t = props.result.totalRate
  if (t < 20) return 'badge badge-success'
  if (t < 50) return 'badge badge-warning'
  return 'badge badge-error'
})
</script>
