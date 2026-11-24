<script setup lang="ts">
	import { computed } from "vue";

	const props = defineProps<{
		status: string;
		size?: "sm" | "md";
	}>();

	const badgeConfig = computed(() => {
		const s = props.status?.toLowerCase() || "";

		if (
			[
				"selesai",
				"diterima penuh",
				"lunas",
				"aman",
				"posted",
				"active",
				"terkirim & diterima",
				"lancar",
			].includes(s)
		) {
			return "success";
		}
		if (
			[
				"menipis",
				"sebagian diterima",
				"belum dibayar",
				"sebagian dibayar",
				"dalam transit",
				"diproses",
				"menunggu persetujuan",
				"dalam pengiriman",
				"diajukan",
			].includes(s)
		) {
			return "warning";
		}

		// Danger / Error variants
		if (
			[
				"kritis",
				"jatuh tempo",
				"ditolak",
				"dibatalkan",
				"inactive",
				"rusak/cacat",
				"gagal kirim",
			].includes(s)
		) {
			return "danger";
		}

		// Info / Sky variants
		if (
			[
				"disetujui",
				"corporate",
				"reseller",
				"transfer bank",
				"siap dikirim",
			].includes(s)
		) {
			return "info";
		}
		return "neutral";
	});
</script>

<template>
	<span
		class="status-badge"
		:class="[
			`status-badge--${badgeConfig}`,
			size === 'sm' ? 'status-badge--sm' : 'status-badge--md',
		]">
		<span>{{ status }}</span>
	</span>
</template>
