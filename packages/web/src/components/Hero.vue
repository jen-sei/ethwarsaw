<template>
  <Button @click="_register" v-if="!isRegistered">
    <span v-if="!isConnected">Connect</span>
    <span v-else>Register</span>
  </Button>
  <div v-else>Successfully registered!</div>
</template>

<script lang="ts" setup>
import Button from "./common/Button.vue";
import { useRegister } from "../composables/useRegister";
import { useAccount, useChainId, useConnect } from "use-wagmi";
import { ref } from "vue";

const { address, isConnected } = useAccount();
const { isRegistered, register } = useRegister(address, ref(1));
const { connect, connectors } = useConnect();

async function _register() {
  if (!isConnected.value)
    await connect({
      connector: connectors.value[0],
    });

  await register();
}
</script>
