#!/bin/bash
# Usage: ./run_both.sh <node_port> <server_port> <server_host> [additional server args]
# node_port: node listen port
# server_port: server listen port
# server_host: server IP or container name (e.g., gmail_server)

if [ $# -lt 3 ]; then
  echo "Usage: $0 <node_port> <server_port> <server_host> [additional server args]"
  exit 1
fi

NODE_PORT=$1
SERVER_PORT=$2
SERVER_HOST=$3
shift 3

# Remove existing containers if they exist
docker rm -f gmail_server 2>/dev/null || true
docker rm -f gmail_node 2>/dev/null || true

# Remove old image if it exists
docker rmi -f gmail_project 2>/dev/null || true

# Build the image
docker build -t gmail_project .

echo "Starting server on port $SERVER_PORT..."
./rScripts/run_server.sh "$SERVER_PORT" "$@" &

sleep 3  # Give the server a moment to start

echo "Starting node on port $NODE_PORT, connecting to server $SERVER_HOST:$SERVER_PORT..."
./rScripts/run_node.sh "$NODE_PORT" "$SERVER_PORT" "$SERVER_HOST" &

wait