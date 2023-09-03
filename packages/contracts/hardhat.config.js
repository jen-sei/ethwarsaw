require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv/config");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    celo: {
      url: "https://forno.celo.org",
      accounts: [process.env.PRIVATE_KEY],
    },
    mantle: {
      url: "https://rpc.mantle.xyz",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      celo: "5KXRRCYWQYRIRU2SY9ZKNCCEJR57RK62V4",
      mantle: "mantle",
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io",
        },
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/5000/etherscan",
          browserURL: "https://mantlescan.info",
        },
      },
    ],
  },
};
