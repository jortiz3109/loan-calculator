<script setup lang="ts">
import { ref } from 'vue'
import FrenchCreditCalculator from './components/FrenchCreditCalculator.vue'
import AmericanCreditCalculator from './components/AmericanCreditCalculator.vue'
import GermanCreditCalculator from './components/GermanCreditCalculator.vue'
import AppFooter from './components/AppFooter.vue'
import ThirdPartyLibraries from './components/ThirdPartyLibraries.vue'

type AmortizationSystem = 'french' | 'american' | 'german' | 'libraries'

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
        <button
          role="tab"
          class="tab"
          :class="activeSystem === 'libraries' ? 'tab-active' : ''"
          @click="activeSystem = 'libraries'"
        >
          Librerías
        </button>
      </div>
    </div>

    <!-- Calculator panels -->
    <FrenchCreditCalculator v-if="activeSystem === 'french'" />
    <AmericanCreditCalculator v-else-if="activeSystem === 'american'" />
    <GermanCreditCalculator v-else-if="activeSystem === 'german'" />
    <ThirdPartyLibraries v-else-if="activeSystem === 'libraries'" />

    <AppFooter />
  </div>
</template>
