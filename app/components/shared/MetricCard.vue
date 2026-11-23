<script setup lang="ts">
	defineProps<{
		title: string;
		value: string;
		subtitle?: string;
		trend?: {
			value: string;
			isUp?: boolean;
			neutral?: boolean;
		};
		badge?: string;
		accentColor?: "blue" | "emerald" | "amber" | "slate";
	}>();
</script>

<template>
	<article
		class="fiori-panel p-4 transition-colors hover:border-[var(--color-accent-border)]">
		<div>
			<!-- Title row -->
			<div class="flex items-center justify-between gap-2 mb-2.5">
				<span
					class="text-[11px] font-semibold text-[#425B73] leading-none truncate">
					{{ title }}
				</span>
				<span
					v-if="badge"
					class="text-[10px] font-semibold px-1.5 py-0.5 bg-[#F5F7FA] text-[#425B73] rounded border border-[#D9E2EC] shrink-0">
					{{ badge }}
				</span>
			</div>

			<!-- Value -->
			<div
				class="text-[22px] font-bold text-[#1D2024] leading-none tabular-nums tracking-tight">
				{{ value }}
			</div>

			<!-- Footer -->
			<div
				v-if="subtitle || trend"
				class="fiori-card-footer flex items-center justify-between gap-2">
				<span class="text-[11px] text-[#425B73] truncate">{{ subtitle }}</span>
				<span
					v-if="trend"
					class="text-[11px] font-semibold shrink-0"
					:class="
						trend.neutral
							? 'text-[#556B82]'
							: trend.isUp
								? 'text-[#256F3A]'
								: 'text-[#AA0808]'
					">
					{{ trend.value }}
				</span>
			</div>
		</div>
	</article>
</template>
