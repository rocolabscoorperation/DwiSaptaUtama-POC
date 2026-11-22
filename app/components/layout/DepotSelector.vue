<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDepotStore } from '~/stores/depot'
import { Building2, ChevronDown, Check } from 'lucide-vue-next'

const depotStore = useDepotStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const selectDepot = (depotId: string) => {
  depotStore.setDepot(depotId)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600/60 transition-colors cursor-pointer"
      title="Pilih Konteks Depot Operasional"
      @click="toggle"
    >
      <Building2 class="w-4 h-4 text-blue-300 shrink-0" />
      <div class="text-left leading-none">
        <span class="block text-xs text-slate-300 uppercase tracking-wider font-normal">Depot Aktif</span>
        <span class="block text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
          {{ depotStore.selectedDepotId === 'ALL' ? 'Semua Depot (Konsolidasi)' : depotStore.currentDepot?.name }}
        </span>
      </div>
      <ChevronDown class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-1 w-68 bg-white rounded border border-slate-200 shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1"
    >
      <div class="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Konteks Wilayah Operasional
      </div>

      <!-- Option: Semua Depot (Konsolidasi) -->
      <button
        v-if="depotStore.canViewAllDepots"
        type="button"
        class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
        :class="{ 'bg-blue-50 font-semibold text-[#0f3b6c]': depotStore.selectedDepotId === 'ALL' }"
        @click="selectDepot('ALL')"
      >
        <div>
          <div class="font-medium text-slate-900">Semua Depot (Konsolidasi)</div>
          <div class="text-xs text-slate-500 mt-0.5">Rekapitulasi gabungan seluruh cabang</div>
        </div>
        <Check v-if="depotStore.selectedDepotId === 'ALL'" class="w-4 h-4 text-blue-700 shrink-0" />
      </button>

      <!-- List of accessible depots -->
      <button
        v-for="d in depotStore.availableDepots"
        :key="d.id"
        type="button"
        class="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 flex items-center justify-between border-t border-slate-50 transition-colors cursor-pointer"
        :class="{ 'bg-blue-50 font-semibold text-[#0f3b6c]': depotStore.selectedDepotId === d.id }"
        @click="selectDepot(d.id)"
      >
        <div>
          <div class="font-medium text-slate-800">{{ d.name }} ({{ d.code }})</div>
          <div class="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{{ d.address }}</div>
        </div>
        <Check v-if="depotStore.selectedDepotId === d.id" class="w-4 h-4 text-blue-700 shrink-0" />
      </button>
    </div>
  </div>
</template>
