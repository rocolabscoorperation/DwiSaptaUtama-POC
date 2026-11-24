<script setup lang="ts">
	import { Menu } from "lucide-vue-next";
	import DepotSelector from "./DepotSelector.vue";
	import UserMenu from "./UserMenu.vue";
	import AppBreadcrumb from "./AppBreadcrumb.vue";

	defineProps<{
		sidebarCollapsed: boolean;
	}>();

	const emit = defineEmits<{
		(e: "toggleSidebar"): void;
	}>();
</script>

<template>
	<header
		class="bg-[var(--color-shell-bg)] text-white sticky top-0 z-30 border-b border-[var(--color-shell-border)]">
		<!-- Shell Bar -->
		<div class="h-12 px-3 sm:px-4 flex items-center justify-between gap-3">
			<!-- Left: Toggle + Brand -->
			<div class="flex items-center gap-3 shrink-0">
				<button
					type="button"
					class="min-h-11 min-w-11 inline-flex items-center justify-center rounded hover:bg-[var(--color-shell-hover)] text-[var(--color-shell-text)] hover:text-white transition-colors cursor-pointer"
					aria-label="Buka atau tutup navigasi"
					@click="emit('toggleSidebar')">
					<Menu class="w-5 h-5" />
				</button>

				<div class="flex items-center gap-2.5">
					<!-- Brand mark -->
					<div class="hidden sm:block">
						<div
							class="text-sm font-bold text-white leading-none tracking-tight">
							PT Dwi Sapta Utama
						</div>
					</div>
				</div>
			</div>

			<!-- Center: Depot Context Indicator -->
			<div class="flex items-center">
				<DepotSelector />
			</div>

			<!-- Right: User -->
			<div class="flex items-center gap-1.5">
				<UserMenu />
			</div>
		</div>

		<!-- Breadcrumb Bar -->
		<div
			class="hidden sm:flex bg-[var(--color-surface)] border-t border-[var(--color-border)] px-4 py-1.5 items-center justify-between">
			<AppBreadcrumb />
		</div>
	</header>
</template>
