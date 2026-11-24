<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from "vue";
	import { useRouter } from "vue-router";
	import { useAuthStore } from "~/stores/auth";
	import { useDepotStore } from "~/stores/depot";
	import type { UserRole } from "~~/shared/types";
	import {
		ChevronDown,
		LogOut,
		Shield,
		RefreshCw,
		Check,
	} from "lucide-vue-next";

	const authStore = useAuthStore();
	const depotStore = useDepotStore();
	const router = useRouter();

	const isOpen = ref(false);
	const dropdownRef = ref<HTMLDivElement | null>(null);

	const toggle = () => {
		isOpen.value = !isOpen.value;
	};

	const handleSwitchRole = (role: UserRole) => {
		authStore.switchUser(role);
		depotStore.checkDepotPermission();
		isOpen.value = false;
	};

	const handleLogout = () => {
		authStore.logout();
		isOpen.value = false;
		router.push("/login");
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
			class="flex items-center gap-2 p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
			@click="toggle">
			<div
				class="w-7 h-7 rounded-full bg-blue-700 border border-blue-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
				{{ authStore.currentUser?.name?.slice(0, 2) || "AD" }}
			</div>
			<div class="hidden md:block text-left leading-tight">
				<div class="text-sm font-semibold text-white truncate max-w-[130px]">
					{{ authStore.currentUser?.name?.split(" ")[0] || "User" }}
				</div>
				<div class="text-xs text-slate-300 truncate max-w-[130px]">
					{{ authStore.currentUser?.roleName }}
				</div>
			</div>
			<ChevronDown
				class="w-3.5 h-3.5 text-slate-400 transition-transform hidden sm:block"
				:class="{ 'rotate-180': isOpen }" />
		</button>

		<div
			v-if="isOpen"
			class="fiori-menu absolute right-0 mt-1.5 w-72 z-50 overflow-hidden">
			<!-- Profile header -->
			<div
				class="px-4 py-3 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
				<div class="text-sm font-bold text-[#1D2024]">
					{{ authStore.currentUser?.name }}
				</div>
				<div class="text-xs text-[#556B82] mt-0.5">
					{{ authStore.currentUser?.email }}
				</div>
				<div class="mt-2 flex items-center gap-2">
					<span
						class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#EEF4FF] text-[#0070F2] border border-[#BADAFF]">
						{{ authStore.currentUser?.roleName }}
					</span>
					<span class="text-xs text-slate-500">
						Akses:
						{{
							authStore.currentUser?.depotIds.length === 2
								? "Semua Depot"
								: "Depot Khusus"
						}}
					</span>
				</div>
			</div>

			<!-- Quick Role Switcher for PoC Demo -->
			<div class="px-3.5 py-2.5 border-b border-slate-100">
				<div class="flex items-center justify-between mb-2">
					<span
						class="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
						<RefreshCw class="w-3 h-3 text-slate-400" />
						Simulasi Ganti Peran (PoC Demo)
					</span>
				</div>
				<div class="space-y-1 max-h-48 overflow-y-auto">
					<button
						v-for="account in authStore.demoAccounts"
						:key="account.id"
						type="button"
						class="w-full text-left px-2.5 py-1.5 rounded text-sm hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
						:class="{
							'bg-blue-50 font-semibold text-[#0f3b6c]':
								authStore.currentUser?.role === account.role,
						}"
						@click="handleSwitchRole(account.role)">
						<div class="truncate">
							<span class="block truncate font-medium text-slate-900">{{
								account.roleName
							}}</span>
							<span
								class="block text-xs text-slate-500 font-mono truncate mt-0.5"
								>{{ account.email }}</span
							>
						</div>
						<Check
							v-if="authStore.currentUser?.role === account.role"
							class="w-3.5 h-3.5 text-blue-700 shrink-0" />
					</button>
				</div>
			</div>

			<!-- Logout Action -->
			<div class="p-1">
				<button
					type="button"
					class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer"
					@click="handleLogout">
					<LogOut class="w-4 h-4" />
					Keluar dari Sistem (Logout)
				</button>
			</div>
		</div>
	</div>
</template>
