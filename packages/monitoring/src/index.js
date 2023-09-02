"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = require("fs");
const redis_1 = require("redis");
const viem_1 = require("viem");
const chains = __importStar(require("viem/chains"));
const CHAIN_NAME = process.env.CHAIN_NAME;
const JSON_RPC_URL = process.env.JSON_RPC_URL;
const RULES_PATH = process.env.RULES_PATH;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const redisClient = (0, redis_1.createClient)();
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        const chain = chains[CHAIN_NAME];
        const ethClient = (0, viem_1.createPublicClient)({ chain: chain, transport: (0, viem_1.http)(JSON_RPC_URL) });
        const rules = yield loadRules(RULES_PATH);
        yield redisClient.connect();
        try {
            for (const rule of rules) {
                if (rule.chainID != chain.id) {
                    continue;
                }
                const address = (0, viem_1.getAddress)(rule.contractAddress);
                const event = (0, viem_1.parseAbiItem)(rule.eventABIString);
                ethClient.watchEvent({
                    address: address,
                    event: event,
                    onLogs: (logs) => __awaiter(this, void 0, void 0, function* () {
                        for (const log of logs) {
                            yield handleLog(redisClient, rule, log);
                        }
                    }),
                });
            }
        }
        finally {
            yield redisClient.quit();
        }
    });
}
function loadRules(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = yield fs_1.promises.readFile(path, 'utf-8');
        const rules = JSON.parse(file);
        return rules;
    });
}
function handleLog(redisClient, rule, log) {
    return __awaiter(this, void 0, void 0, function* () {
        // if (
    });
}
// async function isRegistered(redisClient, address: Address): boolean {
//     const key = makeUserKey(address);
// }
function storeEncounter(redisClient, rule, log) {
    return __awaiter(this, void 0, void 0, function* () { });
}
main().then(() => console.log('finished'));
