<script setup lang="ts">
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import { useAuthStore } from "~/stores/auth";
	import { useDepotStore } from "~/stores/depot";
	import { ShieldCheck, LogIn, AlertCircle } from "lucide-vue-next";

	definePageMeta({
		layout: "auth",
	});

	const authStore = useAuthStore();
	const depotStore = useDepotStore();
	const router = useRouter();

	const email = ref("superadmin@demo.com");
	const password = ref("demo123");
	const errorMsg = ref("");

	const handleLogin = () => {
		errorMsg.value = "";
		const success = authStore.login(email.value, password.value);
		if (success) {
			depotStore.checkDepotPermission();
			router.push("/dashboard");
		} else {
			errorMsg.value =
				"Email atau kata sandi tidak valid. Gunakan salah satu akun demo di bawah.";
		}
	};

	const selectDemoUser = (userEmail: string) => {
		email.value = userEmail;
		password.value = "demo123";
		handleLogin();
	};
</script>

<template>
	<div
		class="bg-white rounded border border-[#EAF0F5] shadow-lg overflow-hidden flex flex-col md:flex-row">
		<!-- Left Hero / Brand Pane -->
		<div
			class="bg-[#0b2447] text-white p-8 md:w-5/12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
			<div>
				<div class="flex items-center gap-2.5 mb-6">
					<div>
						<div
							class="text-sm font-bold tracking-tight text-white leading-none">
							PT DWI SAPTA UTAMA
						</div>
						<div
							class="text-xs text-blue-300 uppercase tracking-widest font-semibold mt-1">
							Distribusi Resmi Aqua Bali
						</div>
					</div>
				</div>

				<h2
					class="text-xl font-bold tracking-tight text-white mb-2 leading-snug">
					Enterprise Resource Planning (ERP) Prototype
				</h2>
				<p class="text-sm text-slate-300 leading-relaxed">
					Sistem manajemen terpadu rantai pasok, pergudangan depot, penjualan
					galon, dan pelaporan keuangan terintegrasi.
				</p>

				<div
					class="mt-6 pt-6 border-t border-slate-800 space-y-2.5 text-sm text-slate-300">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-emerald-400" />
						<span>Konteks Multidepot (Denpasar & Jimbaran)</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-[#5B9BD5]" />
						<span>Alur Transaksi & Mutasi Stok Terpadu</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full bg-amber-400" />
						<span>Standar Tampilan SAP Fiori Enterprise</span>
					</div>
				</div>
			</div>

			<div
				class="mt-8 pt-4 border-t border-slate-800/80 text-xs text-[#647B91]">
				Proof of Concept (PoC) Frontend Prototype — 2026
			</div>
		</div>

		<!-- Right Login Form Pane -->
		<div class="p-6 md:p-8 md:w-7/12 flex flex-col justify-between">
			<div>
				<div class="mb-5">
					<h3 class="text-xl font-bold text-[#1D2024] tracking-tight">
						Masuk ke Akun Sistem
					</h3>
					<p class="text-sm text-[#425B73] mt-1">
						Silakan masukkan kredensial demo atau pilih akun cepat di bawah ini.
					</p>
				</div>

				<form class="space-y-4" @submit.prevent="handleLogin">
					<div>
						<label class="block text-sm font-semibold text-[#1D2024] mb-1.5"
							>Alamat Email</label
						>
						<input
							v-model="email"
							type="email"
							required
							class="w-full px-3 py-2 text-sm bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A6ED1] focus:border-blue-600 transition-colors"
							placeholder="nama@demo.com" />
					</div>

					<div>
						<label class="block text-sm font-semibold text-[#1D2024] mb-1.5"
							>Kata Sandi</label
						>
						<input
							v-model="password"
							type="password"
							required
							class="w-full px-3 py-2 text-sm bg-[#F5F7FA] border border-[#D9E2EC] rounded focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0A6ED1] focus:border-blue-600 transition-colors"
							placeholder="demo123" />
					</div>

					<div
						v-if="errorMsg"
						class="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
						<AlertCircle class="w-4 h-4 shrink-0" />
						<span>{{ errorMsg }}</span>
					</div>

					<button
						type="submit"
						class="w-full mt-2 py-2.5 px-4 bg-[#0A6ED1] hover:bg-[#0854A0] text-white font-semibold rounded text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer">
						<LogIn class="w-4 h-4" />
						<span>Masuk ke Dashboard</span>
					</button>
				</form>

				<!-- 1-Click Quick Demo User Switcher -->
				<div class="mt-6 pt-5 border-t border-[#EAF0F5]">
					<div
						class="text-xs font-bold uppercase tracking-wider text-[#425B73] mb-2.5 flex items-center gap-1.5">
						<ShieldCheck class="w-4 h-4 text-blue-700" />
						Pilih Cepat Akun Demo (1-Click Login):
					</div>

					<div
						class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
						<button
							v-for="acc in authStore.demoAccounts"
							:key="acc.id"
							type="button"
							class="text-left p-2.5 rounded border border-[#EAF0F5] hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer"
							@click="selectDemoUser(acc.email)">
							<div class="font-semibold text-slate-800 text-sm">
								{{ acc.roleName }}
							</div>
							<div class="text-xs text-[#425B73] font-mono truncate mt-0.5">
								{{ acc.email }}
							</div>
						</button>
					</div>
				</div>
			</div>

			<div class="mt-6 text-center text-xs text-[#647B91]">
				Semua akun demo menggunakan sandi:
				<span class="font-mono font-semibold text-slate-600">demo123</span>
			</div>
		</div>
	</div>
</template>
