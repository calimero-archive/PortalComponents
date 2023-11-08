#!/usr/bin/env bash

if [ "$#" -ne 3 ]; then
    echo "Illegal number of parameters (shard_id, owner_id, default_groups -> '{\"name1\": [\"owner\", bool_read_only] }')"
    exit 1
fi

cd "$(dirname "$0")"
args="{\"name\": \"Calimero Mero\", \"assets\": \"\", \"owner\": \"$2\", \"default_groups\": $3}"

near deploy \
  --accountId "chat-1110.$1" \
  --wasmFile ../../target/near/curb/curb.wasm \
  --initFunction new --initArgs "$args" \
  --nodeUrl "https://api.staging.calimero.network/api/v1/shards/$1-calimero-testnet/neard-rpc" \
  --networkId "$1-calimero-testnet"
