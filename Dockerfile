FROM gcc:latest
 
COPY . /usr/src/mytest
 
WORKDIR /usr/src/mytest
 
RUN mkdir build
 
WORKDIR /usr/src/mytest/build
RUN apt-get update && apt-get install -y cmake python3 nodejs npm
RUN cmake .. && make

WORKDIR /usr/src/mytest/src
RUN npm install

WORKDIR /usr/src/mytest/build

CMD ["echo", "Please specify a command to run"]