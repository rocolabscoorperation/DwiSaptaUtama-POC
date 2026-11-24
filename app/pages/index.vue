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
  <div class="p-8 text-center text-[#425B73]">
    Mengarahkan ke Dashboard...
  </div>
</template>
