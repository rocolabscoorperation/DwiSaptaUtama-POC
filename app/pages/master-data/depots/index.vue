<script setup lang="ts">
import { useDepotStore } from '~/stores/depot'
import PageHeader from '~/components/shared/PageHeader.vue'
import StatusBadge from '~/components/shared/StatusBadge.vue'
import { Building2, Phone, MapPin, User, CheckCircle2 } from 'lucide-vue-next'

const depotStore = useDepotStore()
</script>

<template>
  <div class="space-y-4">
    <PageHeader
      title="Master Depot & Cabang Distribusi"
      subtitle="Dua pangkalan depot operasional PT Dwi Sapta Utama untuk melayani area Bali Selatan dan Denpasar."
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="depot in depotStore.depots"
        :key="depot.id"
        class="bg-white border rounded p-4 shadow-xs transition-all relative overflow-hidden"
        :class="depotStore.selectedDepotId === depot.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0f3b6c]">
              <Building2 class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-slate-900">{{ depot.name }}</h3>
                <span class="font-mono text-xs px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded font-semibold">
                  {{ depot.code }}
                </span>
              </div>
              <span class="text-[11px] text-slate-500">ID: {{ depot.id }}</span>
            </div>
          </div>
          <StatusBadge :status="depot.status" size="sm" />
        </div>

        <div class="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div class="flex items-start gap-2">
            <MapPin class="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span class="leading-relaxed">{{ depot.address }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-slate-400 shrink-0" />
            <span class="font-mono">{{ depot.phone }}</span>
          </div>
          <div class="flex items-center gap-2">
            <User class="w-4 h-4 text-slate-400 shrink-0" />
            <span>Kepala Depot: <strong class="text-slate-800">{{ depot.manager }}</strong></span>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span
            v-if="depotStore.selectedDepotId === depot.id"
            class="text-xs font-semibold text-blue-700 flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5" /> Sedang Aktif di Header
          </span>
          <span v-else class="text-xs text-slate-400">
            Konteks Sekunder
          </span>

          <button
            type="button"
            class="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
            @click="depotStore.setDepot(depot.id)"
          >
            Pilih Depot Ini
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
