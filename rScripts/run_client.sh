#!/bin/bash
# This script runs a Docker container for the Gmail project.

if [ $# -lt 2 ]; then
  echo "Usage: $0 <port> <ip> [additional arguments...]"
  exit 1
fi

docker run -it --network="host" gmail_project python3 /usr/src/mytest/src/client.py "$@"