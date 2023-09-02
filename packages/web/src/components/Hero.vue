<template>
  <Button @click="clickHandler">
    <span v-if="!isConnected">Connect</span>
    <span v-else-if="!isRegistered">Register</span>
    <span v-else>Start your journey</span>
  </Button>
</template>

<script lang="ts" setup>
import Button from "./common/Button.vue";
import { useRegister } from "../composables/useRegister";
import { useAccount, useChainId, useConnect } from "use-wagmi";
import { ref } from "vue";

const { address, isConnected } = useAccount();
const { isRegistered, register, tryNavigateToTelegram, chatSecret } =
  useRegister(address, ref(1));
const { connect, connectors } = useConnect();

async function clickHandler() {
  if (!isConnected.value)
    await connect({
      connector: connectors.value[0],
    });
  else if (!isRegistered.value) {
    await register();
  } else if (chatSecret.value) {
    tryNavigateToTelegram();
  }
}
</script>
