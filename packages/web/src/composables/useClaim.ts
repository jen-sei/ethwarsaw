import { useSendTransaction, useContractWrite } from "use-wagmi";
import { DEPLOYED_ADDRESSES, isChainSupported } from "../config/deployment";
import FluffeABI from "../assets/abi/Fluffe.json";

export const useClaim = function (chainId: number) {
  const contractAddress = DEPLOYED_ADDRESSES.Fluffe[chainId];
  const { writeAsync, isLoading, isSuccess, error } = useContractWrite({
    abi: FluffeABI,
    address: contractAddress,
    functionName: "mint",
  });

  async function claim(
    to: string,
    tokenId: string,
    uriIndex: string,
    authorizationSignature: string
  ) {
    if (!isChainSupported(chainId)) {
      console.log("Chain not supported.");
      return false;
    }

    const hash = await writeAsync({
      args: [to, tokenId, uriIndex, authorizationSignature],
    });

    return hash;
  }

  return {
    isSuccess,
    isLoading,
    claim,
    error,
  };
};
