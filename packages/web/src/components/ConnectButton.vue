<template>
  <Button
    v-bind="$attrs"
    v-for="x in connectors"
    :key="x.name"
    :disabled="!x.ready || isReconnecting || connector?.id === x.id"
    @click="() => connect({ connector: x })"
  >
    <span>Connect</span>
    <span v-if="!x.ready"> (unsupported)</span>
    <span v-if="isLoading && x.id === pendingConnector?.id">…</span>
  </Button>
</template>

<script lang="ts" setup>
import Button from "./common/Button.vue";
import { useAccount, useConnect } from "use-wagmi";
import { toRefs } from "vue";

const { connector, isReconnecting } = useAccount();

const props = defineProps({
  chainId: Number,
});

const { chainId } = toRefs(props);

const { connect, connectors, isLoading, pendingConnector } = useConnect({
  chainId,
});
</script>
