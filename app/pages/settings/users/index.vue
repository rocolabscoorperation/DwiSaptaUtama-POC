<script setup lang="ts">
	import { useAuthStore } from "~/stores/auth";
	import { useDepotStore } from "~/stores/depot";
	import PageHeader from "~/components/shared/PageHeader.vue";
	import StatusBadge from "~/components/shared/StatusBadge.vue";
	import { Shield, Check, RefreshCw } from "lucide-vue-next";

	const authStore = useAuthStore();
	const depotStore = useDepotStore();

	const handleSwitch = (role: any) => {
		authStore.switchUser(role);
		depotStore.checkDepotPermission();
	};
</script>

<template>
	<div class="space-y-4">
		<PageHeader
			title="Manajemen Pengguna (User Management)"
			subtitle="Daftar 7 akun demo pengguna sistem ERP PT Dwi Sapta Utama dengan hak akses departemen masing-masing." />

		<div
			class="bg-white border border-[#EAF0F5] rounded shadow-xs overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full text-xs text-left">
					<thead
						class="bg-slate-100 text-slate-600 font-semibold border-b border-[#EAF0F5] uppercase text-[10px] tracking-wider">
						<tr>
							<th class="py-2.5 px-3">ID Pengguna</th>
							<th class="py-2.5 px-3">Nama Pegawai / Jabatan</th>
							<th class="py-2.5 px-3">Email Login</th>
							<th class="py-2.5 px-3">Peran (Role)</th>
							<th class="py-2.5 px-3">Akses Wilayah Depot</th>
							<th class="py-2.5 px-3">Kontak</th>
							<th class="py-2.5 px-3 text-center">Status</th>
							<th class="py-2.5 px-3 text-center">Simulasi Aktif</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						<tr
							v-for="u in authStore.demoAccounts"
							:key="u.id"
							class="hover:bg-[#F5F7FA] transition-colors"
							:class="{ 'bg-blue-50/40': authStore.currentUser?.id === u.id }">
							<td class="py-2.5 px-3 font-mono font-semibold text-blue-900">
								{{ u.id }}
							</td>
							<td class="py-2.5 px-3 font-semibold text-slate-800">
								{{ u.name }}
							</td>
							<td class="py-2.5 px-3 font-mono text-slate-600">
								{{ u.email }}
							</td>
							<td class="py-2.5 px-3">
								<span
									class="inline-flex items-center gap-1 font-semibold text-[#1D2024] bg-slate-100 px-2 py-0.5 rounded text-[11px]">
									<Shield class="w-3 h-3 text-blue-600" />
									{{ u.roleName }}
								</span>
							</td>
							<td class="py-2.5 px-3 text-[#1D2024]">
								<span
									v-if="u.depotIds.length === 2"
									class="font-medium text-emerald-700">
									Semua Depot (DPS & JBR)
								</span>
								<span v-else class="font-mono text-[#1D2024]">
									{{ u.depotIds.join(", ") }}
								</span>
							</td>
							<td class="py-2.5 px-3 font-mono text-[#425B73]">
								{{ u.phone }}
							</td>
							<td class="py-2.5 px-3 text-center">
								<StatusBadge :status="u.status" size="sm" />
							</td>
							<td class="py-2.5 px-3 text-center">
								<span
									v-if="authStore.currentUser?.id === u.id"
									class="inline-flex items-center gap-1 font-bold text-xs text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded">
									<Check class="w-3.5 h-3.5" /> Sedang Login
								</span>
								<button
									v-else
									type="button"
									class="px-2 py-0.5 text-xs text-slate-600 border border-[#D9E2EC] hover:bg-slate-100 rounded transition-colors inline-flex items-center gap-1"
									@click="handleSwitch(u.role)">
									<RefreshCw class="w-3 h-3" /> Ganti Akun
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
