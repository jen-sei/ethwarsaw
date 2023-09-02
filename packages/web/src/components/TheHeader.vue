<template>
  <div class="d-flex h-16 bg-lime-300 w-full justify-between items-center px-4">
    <div
      class="d-flex text-black text-2xl cursor-pointer"
      @click="push({ name: 'Home' })"
    >
      Logo
    </div>
    <!-- <WalletConnection class="d-flex"></WalletConnection> -->
  </div>
</template>
<script lang="ts" setup>
import WalletConnection from "./WalletConnection.vue";
import { useRouter } from "vue-router";

const { push } = useRouter();
</script>
