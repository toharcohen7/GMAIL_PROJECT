FROM gcc:latest

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    cmake \
    python3 \
    nodejs \
    npm \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/mytest

# Copy and install Node.js server dependencies
COPY src/package*.json ./src/
WORKDIR /usr/src/mytest/src
RUN npm install

# Copy and install React client dependencies
COPY src/client/package*.json ./client/
WORKDIR /usr/src/mytest/src/client
RUN npm install

# Optional: Install global npm packages (e.g., nodemon)
RUN npm install -g nodemon

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
