<template>
  <section
    class="bg-gray-900 h-screen flex flex-col justify-center items-center gap-x-16 text-white"
  >
    <div class="w-[300px] h-[420px] bg-transparent group perspective">
      <img src="/card-thumbnail.gif" class="w-full h-full" />
    </div>
    <div class="text-center flex flex-col items-center justify-center pt-4">
      <ConnectButton
        v-if="!isConnected"
        :chain-id="chainId"
        class="bg-white text-black"
      ></ConnectButton>
      <Button
        v-else-if="!isSuccess"
        @click="handleClaimClick"
        class="bg-white text-black"
        :dislabed="isLoading"
      >
        <Spinner v-if="isLoading"></Spinner>
        <span v-else>Claim</span>
      </Button>
      <div v-else>Claim success</div>

      <div v-if="error" class="text-red">
        {{ error.message }}
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import {
  useAccount,
  useSwitchNetwork,
  useNetwork,
  useContractWrite,
} from "use-wagmi";
import { useClaim } from "../composables/useClaim";
import ConnectButton from "../components/ConnectButton.vue";
import Button from "../components/common/Button.vue";
import Spinner from "../components/common/Spinner.vue";

const { isConnected } = useAccount();
const { chain } = useNetwork();
const { switchNetworkAsync } = useSwitchNetwork();

const {
  params: { encounterId },
  query: {
    chainId: queryChainId,
    to,
    tokenId,
    uriIndex,
    authorizationSignature,
  },
} = useRoute();

const chainId = parseInt(queryChainId as string) || 1;

const { error, isLoading, isSuccess, claim } = useClaim(chainId);

async function handleClaimClick() {
  if (chain && chain.value?.id !== chainId) {
    const newChain = await switchNetworkAsync(chainId);
    if (newChain.id !== chainId) {
      return false;
    }
  }

  if (!to || !tokenId || !uriIndex || !authorizationSignature) {
    throw Error("Cannot claim due to missing parameters.");
  }

  await claim(
    to.toString(),
    tokenId.toString(),
    uriIndex.toString(),
    authorizationSignature.toString()
  );
}
</script>
