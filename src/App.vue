<script setup lang="ts">
import { ref, nextTick } from 'vue'
import CreditCalculator from './components/CreditCalculator.vue'
import AmericanCreditCalculator from './components/AmericanCreditCalculator.vue'
import AppFooter from './components/AppFooter.vue'

type AmortizationSystem = 'french' | 'american'

const systems: AmortizationSystem[] = ['french', 'american']
const activeSystem = ref<AmortizationSystem>('french')

function onTabKeydown(event: KeyboardEvent) {
  const current = systems.indexOf(activeSystem.value)
  let next: AmortizationSystem | null = null
  if (event.key === 'ArrowRight') {
    next = systems[(current + 1) % systems.length]
  } else if (event.key === 'ArrowLeft') {
    next = systems[(current - 1 + systems.length) % systems.length]
  }
  if (next !== null) {
    event.preventDefault()
    activeSystem.value = next
    nextTick(() => {
      const el = document.getElementById(`tab-${next}`)
      el?.focus()
    })
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
          @keydown="onTabKeydown"
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
          @keydown="onTabKeydown"
        >
          Sistema Americano
        </button>
      </div>
    </div>

    <!-- Calculator panels -->
    <div
      id="panel-french"
      role="tabpanel"
      aria-labelledby="tab-french"
      v-show="activeSystem === 'french'"
    >
      <CreditCalculator />
    </div>
    <div
      id="panel-american"
      role="tabpanel"
      aria-labelledby="tab-american"
      v-show="activeSystem === 'american'"
    >
      <AmericanCreditCalculator />
    </div>

    <AppFooter />
  </div>
</template>
