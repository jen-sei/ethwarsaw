<template>
  <section
    class="bg-gray-900 h-screen flex justify-center items-center gap-x-16 text-white"
  >
    <div
      class="w-[300px] h-[420px] bg-transparent cursor-pointer group perspective"
    >
      <div
        class="relative preserve-3d my-rotate-y-180 w-full h-full duration-1000"
      >
        <div class="absolute backface-hidden border-2 w-full h-full">
          <img src="/card-thumbnail.gif" class="w-full h-full" />
        </div>
        <div
          class="absolute my-rotate-y-180 backface-hidden w-full h-full bg-gray-100 overflow-hidden"
        >
          <div
            class="text-center flex flex-col items-center justify-center h-full text-gray-800 px-2 pb-24"
          >
            <ClaimButton></ClaimButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import ClaimButton from "../components/ClaimButton.vue";

const {
  params: { encounterId },
} = useRoute();
</script>
