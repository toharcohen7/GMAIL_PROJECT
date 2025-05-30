#!/bin/bash
# This script runs a Docker container for the Gmail project client.

if [ $# -lt 2 ]; then
  echo "Usage: $0 <port> <ip> [additional arguments...]"
  exit 1
fi

# Remove existing client container if it exists
docker rm -f gmail_client 2>/dev/null || true

# Check if the image exists, build if not
if ! docker image inspect gmail_project >/dev/null 2>&1; then
  docker build -t gmail_project .
fi

docker run -it --name gmail_client --network="host" gmail_project python3 /usr/src/mytest/src/client.py "$@"