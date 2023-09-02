<template>
  <section
    class="bg-gray-900 h-screen flex justify-center items-center gap-x-16 text-white"
  >
    <Spinner v-if="fetchInProgress"></Spinner>
    <div
      v-else
      v-for="answerIndex in possibleAnswers"
      @click="_submitGameAnswer(answerIndex.toString())"
      class="w-[300px] h-[420px] bg-transparent cursor-pointer group perspective"
    >
      <div
        class="relative preserve-3d w-full h-full duration-1000"
        :class="{ 'my-rotate-y-180': game?.answer == answerIndex.toString() }"
      >
        <div class="absolute backface-hidden border-2 w-full h-full">
          <img src="/card-thumbnail.gif" class="w-full h-full" />
        </div>
        <div
          class="absolute my-rotate-y-180 backface-hidden w-full h-full bg-gray-100 overflow-hidden"
        >
          <Spinner v-if="submissionInProgress"></Spinner>
          <div
            v-else
            class="text-center flex flex-col items-center justify-center h-full text-gray-800 px-2 pb-24"
          >
            <span v-if="game?.correctAnswer == answerIndex.toString()"
              >Congratulations!</span
            >
            <span v-else>Uf!</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router";
import { useGameApi } from "../composables/useGameApi";
import Spinner from "../components/common/Spinner.vue";

const {
  params: { encounterId },
} = useRoute();

const possibleAnswers = 3;

const { game, fetchInProgress, submissionInProgress, submitGameAnswer } =
  useGameApi(encounterId as string);

async function _submitGameAnswer(index: string) {
  if (game.value?.answer == undefined) {
    await submitGameAnswer(index);
  }
}
</script>
