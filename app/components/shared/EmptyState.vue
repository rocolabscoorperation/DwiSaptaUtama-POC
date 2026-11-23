<script setup lang="ts">
	import { Inbox } from "lucide-vue-next";

	defineProps<{
		title?: string;
		description?: string;
	}>();
</script>

<template>
	<div
		class="fiori-panel fiori-dashed-panel flex flex-col items-center justify-center py-12 px-6 text-center">
		<div
			class="w-10 h-10 rounded bg-[#EAF0F5] flex items-center justify-center text-[#647B91] mb-3">
			<Inbox class="w-5 h-5" />
		</div>
		<h4 class="text-sm font-semibold text-slate-700">
			{{ title || "Tidak ada data ditemukan" }}
		</h4>
		<p class="text-xs text-slate-500 max-w-sm mt-1">
			{{
				description ||
				"Belum ada catatan yang sesuai dengan filter atau konteks depot yang dipilih."
			}}
		</p>
	</div>
</template>
