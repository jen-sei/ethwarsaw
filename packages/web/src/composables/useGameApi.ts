import { Ref, computed, ref } from "vue";
import {
  EncounterGame,
  getEncounterGame,
  submitGameAnswer,
} from "../plugins/api";

export function useGameApi(encounterId: string) {
  const fetchInProgress = ref(false);

  const submissionInProgress = ref(false);
  const game: Ref<EncounterGame | undefined> = ref(undefined);

  async function _getEncounterGame() {
    fetchInProgress.value = true;

    try {
      const response = await getEncounterGame(encounterId);
      if (response.data) {
        game.value = response.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      fetchInProgress.value = false;
    }
  }

  async function _submitGameAnswer(answerIndex: string) {
    submissionInProgress.value = true;

    try {
      const response = await submitGameAnswer(encounterId, answerIndex);
      if (response.data) {
        game.value = response.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      submissionInProgress.value = false;
    }
  }

  _getEncounterGame();

  return {
    getEncounterGame: _getEncounterGame,
    submitGameAnswer: _submitGameAnswer,
    fetchInProgress,
    submissionInProgress,
    game,
  };
}
