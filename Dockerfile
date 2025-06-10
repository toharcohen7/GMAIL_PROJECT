FROM gcc:latest

RUN apt-get update && apt-get install -y \
    cmake \
    python3 \
    nodejs \
    npm \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/mytest

COPY src/package*.json ./src/
WORKDIR /usr/src/mytest/src
RUN npm install

WORKDIR /usr/src/mytest
COPY . .

RUN mkdir -p build
WORKDIR /usr/src/mytest/build
RUN cmake .. && make

CMD ["echo", "Please specify a command to run"]
