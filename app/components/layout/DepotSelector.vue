<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useDepotStore } from '~/stores/depot'
import { Building2, ChevronDown, Check } from 'lucide-vue-next'

const depotStore = useDepotStore()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => { isOpen.value = !isOpen.value }

const selectDepot = (depotId: string) => {
  depotStore.setDepot(depotId)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors"
      style="background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15);"
      :class="isOpen ? 'bg-[rgba(255,255,255,0.14)]' : 'hover:bg-[rgba(255,255,255,0.12)]'"
      title="Pilih Depot"
      @click="toggle"
    >
      <Building2 class="w-3.5 h-3.5 text-[#7FB3E0] shrink-0" />
      <div class="text-left leading-none hidden sm:block">
        <div class="text-[10px] text-[#7FB3E0] uppercase tracking-wider font-medium">Depot</div>
        <div class="text-sm font-semibold text-white truncate max-w-[150px]">
          {{ depotStore.selectedDepotId === 'ALL' ? 'Semua Depot' : depotStore.currentDepot?.name }}
        </div>
      </div>
      <div class="text-sm font-semibold text-white sm:hidden truncate max-w-[100px]">
        {{ depotStore.selectedDepotId === 'ALL' ? 'Semua' : (depotStore.currentDepot?.code || 'Depot') }}
      </div>
      <ChevronDown
        class="w-3.5 h-3.5 text-[#7FB3E0] shrink-0 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-1.5 w-64 bg-white rounded-md shadow-lg z-50 overflow-hidden"
      style="border: 1px solid #E0E5EB; box-shadow: 0 8px 24px rgba(0,0,0,.12);"
    >
      <div class="px-3 py-2 text-[11px] font-semibold text-[#556B82] uppercase tracking-wider border-b border-[#E0E5EB] bg-[#F5F6F8]">
        Pilih Konteks Wilayah
      </div>

      <!-- All depots -->
      <button
        v-if="depotStore.canViewAllDepots"
        type="button"
        class="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors"
        :class="depotStore.selectedDepotId === 'ALL' ? 'bg-[#EEF4FF]' : 'hover:bg-[#F5F6F8]'"
        @click="selectDepot('ALL')"
      >
        <div>
          <div class="text-sm font-semibold text-[#1D2024]">Semua Depot (Konsolidasi)</div>
          <div class="text-xs text-[#556B82] mt-0.5">Rekapitulasi gabungan seluruh cabang</div>
        </div>
        <Check v-if="depotStore.selectedDepotId === 'ALL'" class="w-4 h-4 text-[#0070F2] shrink-0" />
      </button>

      <!-- Depot list -->
      <button
        v-for="d in depotStore.availableDepots"
        :key="d.id"
        type="button"
        class="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 border-t border-[#EEF1F5] cursor-pointer transition-colors"
        :class="depotStore.selectedDepotId === d.id ? 'bg-[#EEF4FF]' : 'hover:bg-[#F5F6F8]'"
        @click="selectDepot(d.id)"
      >
        <div>
          <div class="text-sm font-semibold text-[#1D2024]">{{ d.name }}</div>
          <div class="text-xs text-[#556B82] mt-0.5 truncate max-w-[200px]">{{ d.address }}</div>
        </div>
        <Check v-if="depotStore.selectedDepotId === d.id" class="w-4 h-4 text-[#0070F2] shrink-0" />
      </button>
    </div>
  </div>
</template>
