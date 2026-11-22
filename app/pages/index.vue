<script setup lang="ts">
definePageMeta({
  middleware: [
    () => {
      return navigateTo('/dashboard')
    }
  ]
})
</script>

<template>
  <div class="p-8 text-center text-slate-500">
    Mengarahkan ke Dashboard...
  </div>
</template>
