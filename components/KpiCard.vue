<template>
  <div class="rounded-xl bg-autoSlate p-4 border border-autoSteel">
    <p class="text-xs uppercase text-slate-400">{{ title }}</p>
    <p class="mt-2 text-2xl font-bold text-white">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});
</script>
