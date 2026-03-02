<script setup lang="ts">
import { ref } from 'vue'
import CreditCalculator from './components/CreditCalculator.vue'
import AmericanCreditCalculator from './components/AmericanCreditCalculator.vue'
import AppFooter from './components/AppFooter.vue'

type AmortizationSystem = 'french' | 'american'

const activeSystem = ref<AmortizationSystem>('french')
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <!-- Tab bar -->
    <div class="bg-base-100 border-b border-base-300 flex justify-center px-4 pt-4">
      <div role="tablist" class="tabs tabs-bordered">
        <button
          role="tab"
          class="tab"
          :class="activeSystem === 'french' ? 'tab-active' : ''"
          @click="activeSystem = 'french'"
        >
          Sistema Francés
        </button>
        <button
          role="tab"
          class="tab"
          :class="activeSystem === 'american' ? 'tab-active' : ''"
          @click="activeSystem = 'american'"
        >
          Sistema Americano
        </button>
      </div>
    </div>

    <!-- Calculator panels -->
    <CreditCalculator v-if="activeSystem === 'french'" />
    <AmericanCreditCalculator v-else-if="activeSystem === 'american'" />

    <AppFooter />
  </div>
</template>
