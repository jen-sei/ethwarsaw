import dotenv from 'dotenv';
dotenv.config();

import { promises as fsPromises } from 'fs';
import { createClient } from 'redis';
import { Address, createPublicClient, getAddress, http, parseAbiItem } from 'viem';
import * as chains from 'viem/chains';

const CHAIN_NAME = process.env.CHAIN_NAME;
const JSON_RPC_URL = process.env.JSON_RPC_URL;
const RULES_PATH = process.env.RULES_PATH;

interface Rule {
  chainID: number;
  contractAddress: string;
  eventABIString: string;
  addressArgument: string;
  nftType: string;
}

async function main() {
  const redisClient = createClient();
  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  const chain = chains[CHAIN_NAME];
  const ethClient = createPublicClient({ chain: chain, transport: http(JSON_RPC_URL) });

  const rules = await loadRules(RULES_PATH);

  await redisClient.connect();
  try {
    for (const rule of rules) {
      if (rule.chainID != chain.id) {
        continue;
      }
      const address = getAddress(rule.contractAddress);
      const event = parseAbiItem(rule.eventABIString);
      ethClient.watchEvent({
        address: address,
        event: event,
        onLogs: async (logs) => {
          for (const log of logs) {
            await handleLog(redisClient, rule, log);
          }
        },
      });
    }
  } finally {
    await redisClient.quit();
  }
}

async function loadRules(path: string): Promise<Rule[]> {
  const file = await fsPromises.readFile(path, 'utf-8');
  const rules = JSON.parse(file);
  return rules;
}

async function handleLog(redisClient, rule: Rule, log) {
  // if (
}

// async function isRegistered(redisClient, address: Address): boolean {
//     const key = makeUserKey(address);
// }

async function storeEncounter(redisClient, rule: Rule, log) {}

main().then(() => console.log('finished'));
