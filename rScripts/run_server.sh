#!/bin/bash
# This script runs a Docker container for the Gmail project.

if [ $# -lt 1 ]; then
  echo "Usage: $0 <port> [additional arguments...]"
  exit 1
fi

PORT=$1

# Remove existing server container if it exists
docker rm -f gmail_server 2>/dev/null || true

# Check if the image exists, build if not
if ! docker image inspect gmail_project >/dev/null 2>&1; then
  docker build -t gmail_project .
fi

# Check if the network exists, create if not
if ! docker network ls | grep -q gmailnetdth; then
  docker network create gmailnetdth
fi


docker run --network gmailnetdth --name gmail_server -p "$PORT:$PORT" gmail_project ./runServer "$@"