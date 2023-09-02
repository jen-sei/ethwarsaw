<template>
  <button
    class="px-2 py-2 rounded-md text-lg cursor-pointer"
    @click="emits('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const emits = defineEmits(["click"]);
</script>
