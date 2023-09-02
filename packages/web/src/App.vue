<template>
  <div class="h-screen flex flex-col w-full">
    <TheHeader class="flex"></TheHeader>
    <RouterView class="flex flex-1 overflow-auto"></RouterView>
    <TheFooter class="flex"></TheFooter>
  </div>
</template>

<script lang="ts" setup>
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";
import { RouterView } from "vue-router";
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
