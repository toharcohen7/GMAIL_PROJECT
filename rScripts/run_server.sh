#!/bin/bash
# This script runs a Docker container for the Gmail project.

if [ $# -lt 1 ]; then
  echo "Usage: $0 <port> [additional arguments...]"
  exit 1
fi

PORT=$1

# Check if the network exists, create if not
if ! docker network ls | grep -q gmailnet; then
  docker network create gmailnet
fi

docker run --network gmailnet --name gmail_server -p "$PORT:$PORT" gmail_project ./runServer "$@"