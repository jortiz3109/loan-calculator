<template>
  <div class="card bg-base-100 shadow-xl w-full max-w-5xl">
    <div class="card-body">
      <h2 class="card-title text-xl font-bold">Tabla de amortización</h2>
      <p class="text-base-content/60 text-sm mb-2">
        Desglose mensual con capital fijo: cada mes pagás el mismo abono a capital y la cuota total va bajando.
      </p>

      <div class="overflow-x-auto">
        <table class="table table-xs table-zebra w-full font-mono">
          <thead>
            <tr>
              <th class="text-center">Mes</th>
              <th class="text-right">Saldo inicial</th>
              <th class="text-right">Intereses</th>
              <th class="text-right">Abono capital</th>
              <th class="text-right">Cuota total</th>
              <th class="text-right">Saldo final</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in schedule" :key="row.month">
              <td class="text-center font-medium">{{ row.month }}</td>
              <td class="text-right">{{ formatCOPDecimals(row.startBalance) }}</td>
              <td class="text-right text-warning">{{ formatCOPDecimals(row.interestPayment) }}</td>
              <td class="text-right text-success">{{ formatCOPDecimals(row.capitalPayment) }}</td>
              <td class="text-right font-medium">{{ formatCOPDecimals(row.totalPayment) }}</td>
              <td class="text-right">{{ formatCOPDecimals(row.endBalance) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="font-bold border-t-2 border-base-300">
              <td class="text-center">Total</td>
              <td></td>
              <td class="text-right text-warning">
                {{ formatCOPDecimals(schedule.reduce((s, r) => s + r.interestPayment, 0)) }}
              </td>
              <td class="text-right text-success">
                {{ formatCOPDecimals(schedule.reduce((s, r) => s + r.capitalPayment, 0)) }}
              </td>
              <td class="text-right">{{ formatCOPDecimals(totalPaid) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <DisclaimerBanner class="mt-4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurrencyFormat } from '../composables/useCurrencyFormat'
import DisclaimerBanner from './DisclaimerBanner.vue'

defineProps<{
  schedule: AmortizationRow[]
  totalPaid: number
}>()

const { formatCOPDecimals } = useCurrencyFormat()
</script>
