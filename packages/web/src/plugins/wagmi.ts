import { configureChains, createConfig } from "use-wagmi";
import { celo, hardhat, mantle } from "use-wagmi/chains";
import { publicProvider } from "use-wagmi/providers/public";
import { InjectedConnector } from "use-wagmi/connectors/injected";

export const { chains, publicClient } = configureChains(
  [celo, mantle, hardhat],
  [publicProvider()],
  {
    pollingInterval: 5000,
  }
);

export const config = createConfig({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  publicClient,
});
