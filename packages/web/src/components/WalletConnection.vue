<template>
  <div v-if="isConnected">
    <span class="d-flex text-black">{{ address }}</span>
    <Button @click="handleDisconnectClick">Disconnect</Button>
  </div>
  <div v-else>
    <button
      v-for="x in connectors"
      :key="x.name"
      :disabled="!x.ready || isReconnecting || connector?.id === x.id"
      @click="() => connect({ connector: x })"
    >
      <span>Connect</span>
      <span v-if="!x.ready"> (unsupported)</span>
      <span v-if="isLoading && x.id === pendingConnector?.id">…</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useConnect, useDisconnect } from "use-wagmi";
import Button from "./common/Button.vue";
const { connector, isReconnecting } = useAccount();
const { connect, connectors, isLoading, pendingConnector } = useConnect();
const { isConnected, address } = useAccount();
const { disconnect } = useDisconnect();

function handleDisconnectClick() {
  disconnect();
}
</script>
