FROM gcc:latest

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    python3 \
    nodejs \
    npm \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/mytest

# Create directory structure explicitly
RUN mkdir -p src/server src/client

# Copy root package.json if it exists
COPY package*.json ./

# Copy server package.json (required)
COPY src/server/package.json ./src/server/

# Copy client package.json
COPY src/client/package.json ./src/client/

# Note: We're not trying to copy package-lock.json files that might not exist

# Install root dependencies if package.json exists
RUN if [ -f package.json ]; then npm install; fi

# Install server dependencies
WORKDIR /usr/src/mytest/src/server
RUN npm install

# Install client dependencies
WORKDIR /usr/src/mytest/src/client
RUN npm install

# Go back to root and copy all files
WORKDIR /usr/src/mytest
COPY . .

# Build C++ server
RUN mkdir -p build
WORKDIR /usr/src/mytest/build
RUN cmake .. && make

# Build React app (production build)
WORKDIR /usr/src/mytest/src/client
RUN npm run build

# Clean up unnecessary files to reduce image size
WORKDIR /usr/src/mytest
RUN rm -rf /usr/src/mytest/src/client/node_modules/.cache

CMD ["echo", "Please specify a command to run"]