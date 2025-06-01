#!/bin/bash
# This script runs app.js inside the gmail_project Docker container.

if [ $# -lt 3 ]; then
  echo "Usage: $0 <port1> <port2> <server_host>"
  exit 1
fi

PORT1=$1
PORT2=$2
SERVER_HOST=$3

# Remove existing node container if it exists
docker rm -f gmail_node 2>/dev/null || true

# Check if the image exists, build if not
if ! docker image inspect gmail_project >/dev/null 2>&1; then
  docker build -t gmail_project .
fi

# Check if the network exists, create if not
if ! docker network ls | grep -q gmailnetdth; then
  docker network create gmailnetdth
fi

docker run --network gmailnetdth --name gmail_node -p "$PORT1:$PORT1" gmail_project node /usr/src/mytest/src/app.js "$PORT1" "$PORT2" "$SERVER_HOST"