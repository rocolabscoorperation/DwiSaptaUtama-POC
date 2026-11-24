<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from "vue";
	import { useDepotStore } from "~/stores/depot";
	import { Building2, ChevronDown, Check } from "lucide-vue-next";

	const depotStore = useDepotStore();
	const isOpen = ref(false);
	const dropdownRef = ref<HTMLElement | null>(null);

	const toggle = () => {
		isOpen.value = !isOpen.value;
	};

	const selectDepot = (depotId: string) => {
		depotStore.setDepot(depotId);
		isOpen.value = false;
	};

	const handleClickOutside = (e: MouseEvent) => {
		if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
			isOpen.value = false;
		}
	};

	onMounted(() => {
		document.addEventListener("click", handleClickOutside);
	});

	onUnmounted(() => {
		document.removeEventListener("click", handleClickOutside);
	});
</script>

<template>
	<div ref="dropdownRef" class="relative">
		<button
			type="button"
			class="fiori-shell-control inline-flex items-center gap-2 px-3 py-1.5 rounded cursor-pointer transition-colors"
			:class="
				isOpen
					? 'bg-[rgba(255,255,255,0.14)]'
					: 'hover:bg-[rgba(255,255,255,0.12)]'
			"
			title="Pilih Depot"
			@click="toggle">
			<Building2 class="w-4 h-4 text-blue-300 shrink-0" />
			<div class="text-left leading-none">
				<span
					class="block text-xs text-slate-300 uppercase tracking-wider font-normal"
					>Depot Aktif</span
				>
				<span
					class="block text-sm font-semibold text-white truncate max-w-[140px] sm:max-w-[180px]">
					{{
						depotStore.selectedDepotId === "ALL"
							? "Semua Depot (Konsolidasi)"
							: depotStore.currentDepot?.name
					}}
				</span>
			</div>
			<ChevronDown
				class="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform"
				:class="{ 'rotate-180': isOpen }" />
		</button>

		<div
			v-if="isOpen"
			class="fiori-menu absolute right-0 mt-1.5 w-64 z-50 overflow-hidden">
			<div class="fiori-menu-heading">Pilih Konteks Wilayah</div>

			<!-- Option: Semua Depot (Konsolidasi) -->
			<button
				v-if="depotStore.canViewAllDepots"
				type="button"
				class="fiori-menu-item"
				:class="{ 'is-selected': depotStore.selectedDepotId === 'ALL' }"
				@click="selectDepot('ALL')">
				<div>
					<div class="font-medium text-slate-900">
						Semua Depot (Konsolidasi)
					</div>
					<div class="text-xs text-slate-500 mt-0.5">
						Rekapitulasi gabungan seluruh cabang
					</div>
				</div>
				<Check
					v-if="depotStore.selectedDepotId === 'ALL'"
					class="w-4 h-4 text-blue-700 shrink-0" />
			</button>

			<!-- List of accessible depots -->
			<button
				v-for="d in depotStore.availableDepots"
				:key="d.id"
				type="button"
				class="fiori-menu-item border-t border-[var(--color-border-soft)]"
				:class="{ 'is-selected': depotStore.selectedDepotId === d.id }"
				@click="selectDepot(d.id)">
				<div>
					<div class="font-medium text-slate-800">
						{{ d.name }} ({{ d.code }})
					</div>
					<div class="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">
						{{ d.address }}
					</div>
				</div>
				<Check
					v-if="depotStore.selectedDepotId === d.id"
					class="w-4 h-4 text-blue-700 shrink-0" />
			</button>
		</div>
	</div>
</template>
