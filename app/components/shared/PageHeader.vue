<script setup lang="ts">
	import { useDepotStore } from "~/stores/depot";
	import { Building2 } from "lucide-vue-next";

	defineProps<{
		title: string;
		subtitle?: string;
		showDepotTag?: boolean;
	}>();

	const depotStore = useDepotStore();
</script>

<template>
	<div
		class="mb-4 pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
		<div>
			<div class="flex items-center gap-2.5 flex-wrap">
				<h1
					class="text-xl font-bold text-[var(--color-text-primary)] leading-tight tracking-tight">
					{{ title }}
				</h1>
				<div
					v-if="showDepotTag"
					class="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
					<Building2 class="w-3.5 h-3.5 text-slate-500" />
					<span>{{
						depotStore.selectedDepotId === "ALL"
							? "Semua Depot"
							: depotStore.currentDepot?.name
					}}</span>
				</div>
			</div>
			<p
				v-if="subtitle"
				class="text-sm text-[var(--color-text-secondary)] mt-1 leading-snug">
				{{ subtitle }}
			</p>
		</div>

		<div class="flex items-center gap-2 shrink-0">
			<slot name="actions" />
		</div>
	</div>
</template>
