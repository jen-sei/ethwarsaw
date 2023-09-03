type DeploymentInfo = {
  [contractName: string]: {
    [chainId: number]: `0x${string}`;
  };
};
export const DEPLOYED_ADDRESSES: DeploymentInfo = {
  Fluffe: {
    5000: "0x7eACD430e2e97fF9AC49F86CcD801d3201CdADa1",
    42220: "0x159b8F3589cb674E9eBfDDdbaF108A25417f7d22",
    31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  },
};

export function isChainSupported(chainId: number) {
  return Object.hasOwn(DEPLOYED_ADDRESSES.Fluffe, chainId);
}
