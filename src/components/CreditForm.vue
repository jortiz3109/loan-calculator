<template>
  <div class="card bg-base-100 shadow-xl w-full">
    <div class="card-body">
      <h1 class="card-title text-2xl font-bold mb-2">Calculadora de Crédito</h1>
      <p class="text-base-content/60 text-sm mb-4">Calcula el costo total de tu crédito bancario</p>

      <div class="flex flex-col gap-4">
        <!-- Monto del crédito -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Monto del crédito (COP)</span>
          </label>
          <input v-model="amountStr" type="number" placeholder="Ej: 5000000" class="input input-bordered w-full" min="1"
            @input="onInput" />
        </div>

        <!-- Número de cuotas -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Número de cuotas</span>
          </label>
          <input v-model="installmentsStr" type="number" placeholder="Ej: 24" class="input input-bordered w-full"
            min="1" step="1" @input="onInput" />
        </div>

        <!-- Valor de cada cuota -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Valor de cada cuota (COP)</span>
          </label>
          <input v-model="installmentAmountStr" type="number" placeholder="Ej: 250000"
            class="input input-bordered w-full" min="1" @input="onInput" />
        </div>

        <!-- Tasa de interés -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Tasa de interés (%)</span>
          </label>
          <div class="flex gap-2">
            <select v-model="rateType" class="select select-bordered w-64 shrink-0" data-testid="rate-type-select"
              @change="onInput">
              <option value="monthly">Tasa efectiva mensual (TEM)</option>
              <option value="annual">Tasa efectiva anual (TEA)</option>
            </select>
            <input v-model="rateStr" type="number" :placeholder="rateType === 'monthly' ? 'Ej: 1.5' : 'Ej: 18.00'"
              data-testid="rate-input" class="input input-bordered flex-1" min="0" step="0.01" @input="onInput" />
          </div>
        </div>

        <!-- Error de validación -->
        <div v-if="displayError" role="alert" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ displayError }}</span>
        </div>

        <!-- Botón calcular -->
        <button class="btn btn-primary w-full" data-testid="calculate-btn" @click="submit">
          Calcular
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { creditFormSchema } from '../schemas/creditFormSchema'

const props = defineProps<{
  externalError?: string
}>()

const emit = defineEmits<{
  calculate: [payload: { amount: string; installments: string; installmentAmount: string | undefined; rate: string; rateType: 'monthly' | 'annual' }]
  reset: []
}>()

const amountStr = ref<string>('')
const installmentsStr = ref<string>('')
const installmentAmountStr = ref<string>('')
const rateStr = ref<string>('')
const rateType = ref<'monthly' | 'annual'>('monthly')
const localError = ref<string>('')

const displayError = computed(() => localError.value || props.externalError || '')

function onInput(): void {
  localError.value = ''
  emit('reset')
}

function submit(): void {
  localError.value = ''

  if (amountStr.value === '' || installmentsStr.value === '' || rateStr.value === '') {
    localError.value = 'Todos los campos son obligatorios.'
    return
  }

  const parsed = creditFormSchema.safeParse({
    amount: amountStr.value,
    installments: installmentsStr.value,
    installmentAmount: installmentAmountStr.value || undefined,
    rate: rateStr.value,
  })

  if (!parsed.success) {
    localError.value = parsed.error.issues[0].message
    return
  }

  emit('calculate', {
    amount: amountStr.value,
    installments: installmentsStr.value,
    installmentAmount: installmentAmountStr.value || undefined,
    rate: rateStr.value,
    rateType: rateType.value,
  })
}
</script>
