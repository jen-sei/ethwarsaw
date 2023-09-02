from dotenv import load_dotenv

load_dotenv()

import json
import os
import random
import time
import redis
from web3 import Web3, HTTPProvider
from eth_utils.conversions import to_hex
from eth_utils.address import to_checksum_address
from eth_utils.crypto import keccak

NEW_ENCOUNTERS_CHANNEL_NAME = "newEncounters"

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = int(os.environ["REDIS_PORT"])
MAX_BLOCK_RANGE = int(os.environ["MAX_BLOCK_RANGE"])
CHAIN_ID = int(os.environ["CHAIN_ID"])
BLOCK_POLL_INTERVAL = int(os.environ["BLOCK_POLL_INTERVAL"])


def main():
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    rules = load_rules()

    provider = HTTPProvider(os.environ["JSON_RPC_URL"])
    w3 = Web3(provider)

    monitor(w3, r, rules)


def load_rules():
    with open(os.environ["RULES_PATH"]) as f:
        rules = json.load(f)
    return [rule for rule in rules if rule["chainID"] == CHAIN_ID]


def monitor(w3, r, rules):
    prev_block_number = w3.eth.block_number
    prev_block_number = 21192556
    while True:
        current_block_number = w3.eth.block_number
        block_number = min(current_block_number, prev_block_number + MAX_BLOCK_RANGE)

        print(f"fetching logs in range {prev_block_number}..{block_number}")
        for rule in rules:
            logs = fetch_logs_in_range(w3, rule, (prev_block_number, block_number))
            for log in logs:
                user_address = get_address_from_log(rule, log)
                if random.random() >= rule["probability"]:
                    print(f"unlucky user missed encounter")
                    continue
                if is_registered_user(r, user_address):
                    print(f"encounter for user {to_checksum_address(user_address)}")
                    store_encounter(r, rule, log, user_address)
                else:
                    print(
                        f"ignoring encounter for unregistered user {to_checksum_address(user_address)}"
                    )

        prev_block_number = block_number
        if block_number >= current_block_number:
            time.sleep(BLOCK_POLL_INTERVAL)


def fetch_logs_in_range(w3, rule, block_range):
    filter_params = get_filter_params(rule, block_range)
    logs = w3.eth.get_logs(filter_params)
    return logs


def get_filter_params(rule, block_range):
    return {
        "fromBlock": block_range[0],
        "toBlock": block_range[1] - 1,
        "address": rule["contractAddress"],
        "topics": rule["eventTopics"],
    }


def get_address_from_log(rule, log):
    if rule["addressTopicIndex"] is not None:
        addressTopic = log.topics[rule["addressTopicIndex"]]
        return addressTopic[12:]
    elif rule["addressDataIndex"] is not None:
        d = bytes(log.data)
        i = rule["addressDataIndex"]
        return d[i : i + 20]
    else:
        raise ValueError("rule must have either address topic or data index")


def is_registered_user(r, user_address):
    key = make_user_key(user_address)
    return r.exists(key) >= 1


def make_user_key(user_address):
    return f"user:{to_checksum_address(user_address)}"


def make_encounter_key(rule, log):
    return f"encounter:{rule['chainID']}:{log['blockNumber']}:{log['logIndex']}"


def make_token_id(rule, log):
    preimage = make_encounter_key(rule, log)
    return keccak(text=preimage)


def make_user_encounters_key(user_address):
    return f"userEncounters:{to_checksum_address(user_address)}"


def make_game_key(rule, log):
    return f"game:{rule['chainID']}:{log['blockNumber']}:{log['logIndex']}"


def store_encounter(r, rule, log, user_address):
    encounter_key = make_encounter_key(rule, log)
    token_id = make_token_id(rule, log)
    encounter = {
        "chainId": rule["chainID"],
        "blockNumber": log["blockNumber"],
        "logIndex": log["logIndex"],
        "txHash": to_hex(log["transactionHash"]),
        "contractAddress": rule["contractAddress"],
        "user": make_user_key(user_address),
        "nftType": rule["nftType"],
        "tokenId": to_hex(token_id),
    }
    r.hset(encounter_key, mapping=encounter)

    game_key = make_game_key(rule, log)
    game = {
        "encounter": encounter_key,
        "status": "pending",
        "givenAnswer": "",
        "correctAnswer": random.randint(0, 2),
    }
    r.hset(game_key, mapping=game)

    user_encounters_key = make_user_encounters_key(user_address)
    r.rpush(user_encounters_key, encounter_key)

    r.publish(NEW_ENCOUNTERS_CHANNEL_NAME, encounter_key)


if __name__ == "__main__":
    main()
