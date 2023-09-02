<template>
  <div v-if="isConnected">
    <Button @click="handleClaimClick">Claim</Button>
  </div>
  <div v-else>
    <Button
      v-for="x in connectors"
      :key="x.name"
      :disabled="!x.ready || isReconnecting || connector?.id === x.id"
      @click="() => connect({ connector: x })"
    >
      <span>Connect</span>
      <span v-if="!x.ready"> (unsupported)</span>
      <span v-if="isLoading && x.id === pendingConnector?.id">…</span>
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useConnect, useDisconnect } from "use-wagmi";
import Button from "./common/Button.vue";

const { connector, isReconnecting } = useAccount();
const { connect, connectors, isLoading, pendingConnector } = useConnect();
const { isConnected, address } = useAccount();

function handleClaimClick() {}
</script>
