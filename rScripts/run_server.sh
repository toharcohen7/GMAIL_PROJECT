#!/bin/bash
# This script runs a Docker container for the Gmail project.

if [ $# -lt 1 ]; then
  echo "Usage: $0 <port> [additional arguments...]"
  exit 1
fi

PORT=$1

docker run -p "$PORT:$PORT" gmail_project ./runServer "$@"