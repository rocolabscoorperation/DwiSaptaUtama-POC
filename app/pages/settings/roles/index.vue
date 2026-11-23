<script setup lang="ts">
import { ROLE_DEFINITIONS } from '~~/shared/constants/roles'
import PageHeader from '~/components/shared/PageHeader.vue'
import { Shield } from 'lucide-vue-next'

const rolesList = Object.values(ROLE_DEFINITIONS)
</script>

<template>
  <div class="space-y-4">
    <PageHeader title="Peran & Hak Akses (Roles & Permissions)"
      subtitle="Matriks hak akses dan tanggung jawab modul operasional ERP PT Dwi Sapta Utama." />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="role in rolesList" :key="role.key"
        class="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Shield class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900">{{ role.name }}</h3>
              <span class="text-[10px] font-mono text-slate-500 uppercase">{{ role.key }}</span>
            </div>
          </div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {{ role.scope }}
          </span>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed">
          {{ role.description }}
        </p>

        <div class="pt-2 border-t border-slate-100">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Modul yang Dapat Diakses:
          </div>
          <div class="flex flex-wrap gap-1">
            <span v-for="mod in role.modules" :key="mod"
              class="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-[#0f3b6c] border border-blue-200/60">
              {{ mod }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
