<script setup lang="ts">
	import { Search } from "lucide-vue-next";

	defineProps<{
		modelValue: string;
		placeholder?: string;
	}>();

	const emit = defineEmits<{
		(e: "update:modelValue", value: string): void;
	}>();
</script>

<template>
	<div class="fiori-toolbar flex-col md:flex-row items-stretch md:items-center">
		<!-- Search -->
		<div class="relative flex-1 min-w-[200px]">
			<div
				class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#8FA3B8]">
				<Search class="w-4 h-4" />
			</div>
			<input
				type="text"
				:value="modelValue"
				:placeholder="placeholder || 'Cari nomor dokumen, produk, atau nama...'"
				class="fiori-input pl-8 pr-3"
				@input="
					emit('update:modelValue', ($event.target as HTMLInputElement).value)
				" />
		</div>

		<div class="flex items-center gap-2 overflow-x-auto shrink-0">
			<slot name="filters" />
		</div>
	</div>
</template>
