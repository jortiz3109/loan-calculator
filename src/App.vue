<script setup lang="ts">
import { ref } from 'vue'
import CreditCalculator from './components/CreditCalculator.vue'
import AmericanCreditCalculator from './components/AmericanCreditCalculator.vue'
import AppFooter from './components/AppFooter.vue'

type AmortizationSystem = 'french' | 'american'

const systems: AmortizationSystem[] = ['french', 'american']
const activeSystem = ref<AmortizationSystem>('french')

function handleTabKeydown(event: KeyboardEvent, tab: AmortizationSystem): void {
  const currentIndex = systems.indexOf(tab)
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    activeSystem.value = systems[(currentIndex + 1) % systems.length]
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    activeSystem.value = systems[(currentIndex - 1 + systems.length) % systems.length]
  } else if (event.key === 'Home') {
    event.preventDefault()
    activeSystem.value = systems[0]
  } else if (event.key === 'End') {
    event.preventDefault()
    activeSystem.value = systems[systems.length - 1]
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <!-- Tab bar -->
    <div class="bg-base-100 border-b border-base-300 flex justify-center px-4 pt-4">
      <div role="tablist" class="tabs tabs-bordered">
        <button
          id="tab-french"
          role="tab"
          class="tab"
          :class="activeSystem === 'french' ? 'tab-active' : ''"
          :aria-selected="activeSystem === 'french'"
          :tabindex="activeSystem === 'french' ? 0 : -1"
          aria-controls="panel-french"
          @click="activeSystem = 'french'"
          @keydown="handleTabKeydown($event, 'french')"
        >
          Sistema Francés
        </button>
        <button
          id="tab-american"
          role="tab"
          class="tab"
          :class="activeSystem === 'american' ? 'tab-active' : ''"
          :aria-selected="activeSystem === 'american'"
          :tabindex="activeSystem === 'american' ? 0 : -1"
          aria-controls="panel-american"
          @click="activeSystem = 'american'"
          @keydown="handleTabKeydown($event, 'american')"
        >
          Sistema Americano
        </button>
      </div>
    </div>

    <!-- Calculator panels -->
    <CreditCalculator v-if="activeSystem === 'french'" id="panel-french" role="tabpanel" aria-labelledby="tab-french" />
    <AmericanCreditCalculator v-else-if="activeSystem === 'american'" id="panel-american" role="tabpanel" aria-labelledby="tab-american" />

    <AppFooter />
  </div>
</template>
