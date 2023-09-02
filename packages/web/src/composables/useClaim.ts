import { useSendTransaction } from "use-wagmi";

export function useClaim() {
  const { isSuccess, isLoading, sendTransactionAsync, error } =
    useSendTransaction();

  function claim(
    to: string,
    tokenId: string,
    uriIndex: string,
    authorizationSignature: string
  ) {
    // ...
  }

  return {
    isSuccess,
    isLoading,
    claim,
    error,
  };
}
