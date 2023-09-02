export const MANTLE_TESTNET_ID = 5001;
export const MANTLE_MAINNET_ID = 5000;
export const CELO_TESTNET_ID = 44787;
export const CELO_MAINNET_ID = 42220;
export const ETHEREUM_MAINNET_ID = 1;
export const ETHEREUM_TESTNET_ID = 5;

export const CHAINS = {
  5000: {
    name: "Mantle",
    chain: "ETH",
    icon: "mantle",
    rpc: ["https://rpc.mantle.xyz", "https://mantle.publicnode.com"],
    faucets: [],
    nativeCurrency: {
      name: "Mantle",
      symbol: "MNT",
      decimals: 18,
    },
    infoURL: "https://mantle.xyz",
    shortName: "mantle",
    chainId: 5000,
    networkId: 5000,
    explorers: [
      {
        name: "Mantle Explorer",
        url: "https://explorer.mantle.xyz",
        standard: "EIP3091",
      },
    ],
    parent: {
      type: "L2",
      chain: "eip155-1",
      bridges: [{ url: "https://bridge.mantle.xyz" }],
    },
  },
  5001: {
    name: "Mantle Testnet",
    chain: "ETH",
    rpc: ["https://rpc.testnet.mantle.xyz"],
    faucets: ["https://faucet.testnet.mantle.xyz"],
    nativeCurrency: {
      name: "Testnet Mantle",
      symbol: "MNT",
      decimals: 18,
    },
    infoURL: "https://mantle.xyz",
    shortName: "mantle-testnet",
    chainId: 5001,
    networkId: 5001,
    explorers: [
      {
        name: "Mantle Testnet Explorer",
        url: "https://explorer.testnet.mantle.xyz",
        standard: "EIP3091",
      },
    ],
  },
  44787: {
    name: "Celo Alfajores Testnet",
    chainId: 44787,
    shortName: "ALFA",
    chain: "CELO",
    networkId: 44787,
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18,
    },
    rpc: [
      "https://alfajores-forno.celo-testnet.org",
      "wss://alfajores-forno.celo-testnet.org/ws",
    ],
    faucets: [
      "https://celo.org/developers/faucet",
      "https://cauldron.pretoriaresearchlab.io/alfajores-faucet",
    ],
    infoURL: "https://docs.celo.org/",
    explorers: [
      {
        name: "Celoscan",
        url: "https://celoscan.io",
        standard: "EIP3091",
      },
    ],
  },
  42220: {
    name: "Celo Mainnet",
    chainId: 42220,
    shortName: "celo",
    chain: "CELO",
    networkId: 42220,
    nativeCurrency: {
      name: "CELO",
      symbol: "CELO",
      decimals: 18,
    },
    rpc: ["https://forno.celo.org", "wss://forno.celo.org/ws"],
    faucets: ["https://free-online-app.com/faucet-for-eth-evm-chains/"],
    infoURL: "https://docs.celo.org/",
    explorers: [
      {
        name: "Celoscan",
        url: "https://celoscan.io",
        standard: "EIP3091",
      },
      {
        name: "blockscout",
        url: "https://explorer.celo.org",
        standard: "none",
      },
    ],
  },
};

export const TESTNET_NETWORKS = {
  [MANTLE_TESTNET_ID]: CHAINS[MANTLE_TESTNET_ID],
  [CELO_TESTNET_ID]: CHAINS[CELO_TESTNET_ID],
};
