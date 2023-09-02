import { Ref, ref } from "vue";

import {
  SessionInfo,
  createSiweMessage,
  getUserSession,
  signIn,
} from "../plugins/api";
import { useSignMessage } from "use-wagmi";

export const useRegister = function (
  address: Ref<string | undefined>,
  chainId: Ref<number | undefined>
) {
  const { signMessageAsync } = useSignMessage();

  const canRegister = ref(false);
  const isRegistered = ref(false);
  const error: Ref<string | undefined> = ref(undefined);
  const chatSecret: Ref<string | undefined> = ref(undefined);

  async function register() {
    if (!address.value || !chainId.value) {
      const errorMessage =
        "Seems like you are not connected to a wallet provider.";
      error.value = errorMessage;
      return console.log(errorMessage);
    }

    const message = await createSiweMessage(
      address.value,
      "Sign in with Ethereum to the app.",
      chainId.value
    );

    try {
      const signature = await signMessageAsync({ message });
      await signIn(message, signature, address.value);
      await checkConnection();
      tryNavigateToTelegram();
    } catch (e) {
      console.log(e);
    }
  }

  function tryNavigateToTelegram() {
    if (chatSecret.value) {
      window.open(`https://t.me/our_bot_username?start=${chatSecret.value}`);
    }
  }

  async function checkConnection() {
    const userSession = await getUserSession();

    if (userSession.authenticated) {
      isRegistered.value = true;
      chatSecret.value = userSession.chatSecret;
    } else {
      isRegistered.value = false;
      chatSecret.value = userSession.chatSecret;
    }
  }

  checkConnection();

  return {
    register,
    canRegister,
    isRegistered,
    chatSecret,
    tryNavigateToTelegram,
    error,
  };
};
