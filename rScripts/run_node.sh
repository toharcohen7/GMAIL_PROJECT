#!/bin/bash
# This script runs app.js inside the gmail_project Docker container.

if [ $# -lt 3 ]; then
  echo "Usage: $0 <port1> <port2> <server_host>"
  exit 1
fi

PORT1=$1
PORT2=$2
SERVER_HOST=$3

# Check if the network exists, create if not
if ! docker network ls | grep -q gmailnet; then
  docker network create gmailnet
fi

docker run --network gmailnet --name gmail_node -p "$PORT1:$PORT1" gmail_project node /usr/src/mytest/src/app.js "$PORT1" "$PORT2" "$SERVER_HOST"