<script setup lang="ts">
import { ref } from 'vue'
import FrenchCreditCalculator from './components/FrenchCreditCalculator.vue'
import AmericanCreditCalculator from './components/AmericanCreditCalculator.vue'
import GermanCreditCalculator from './components/GermanCreditCalculator.vue'
import AppFooter from './components/AppFooter.vue'

type AmortizationSystem = 'french' | 'american' | 'german'

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
        <button
          role="tab"
          class="tab"
          :class="activeSystem === 'german' ? 'tab-active' : ''"
          @click="activeSystem = 'german'"
        >
          Sistema Alemán
        </button>
      </div>
    </div>

    <p class="text-center text-sm text-base-content/70 py-3">Hi Jorg</p>

    <!-- Calculator panels -->
    <FrenchCreditCalculator v-if="activeSystem === 'french'" />
    <AmericanCreditCalculator v-else-if="activeSystem === 'american'" />
    <GermanCreditCalculator v-else-if="activeSystem === 'german'" />

    <AppFooter />
  </div>
</template>
