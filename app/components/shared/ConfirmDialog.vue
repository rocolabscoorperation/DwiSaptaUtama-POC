<script setup lang="ts">
	import { AlertTriangle, X } from "lucide-vue-next";

	defineProps<{
		isOpen: boolean;
		title?: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
	}>();

	const emit = defineEmits<{
		(e: "confirm"): void;
		(e: "cancel"): void;
	}>();
</script>

<template>
	<div
		v-if="isOpen"
		class="fixed inset-0 z-50 flex items-center justify-center p-4 fiori-modal-backdrop">
		<div class="fiori-panel fiori-dialog w-full max-w-sm overflow-hidden">
			<!-- Header -->
			<div
				class="px-4 py-3 flex items-center justify-between border-b border-[var(--color-shell-border)] bg-[var(--color-shell-bg)]">
				<div class="flex items-center gap-2 text-white">
					<AlertTriangle class="w-4 h-4 shrink-0 text-white" />
					<span class="text-sm font-bold text-white">{{
						title || "Konfirmasi Penghapusan"
					}}</span>
				</div>
				<button
					type="button"
					class="text-[#8FA3B8] hover:text-[#1D2024] p-0.5 rounded transition-colors cursor-pointer"
					@click="emit('cancel')">
					<X class="w-4 h-4" />
				</button>
			</div>

			<!-- Body -->
			<div class="px-4 py-4 text-sm text-[#556B82] leading-relaxed">
				{{ message }}
			</div>

			<!-- Footer -->
			<div
				class="px-4 py-3 flex items-center justify-end gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
				<button type="button" class="btn-secondary" @click="emit('cancel')">
					{{ cancelText || "Batal" }}
				</button>
				<button type="button" class="btn-danger" @click="emit('confirm')">
					{{ confirmText || "Ya, Hapus" }}
				</button>
			</div>
		</div>
	</div>
</template>
