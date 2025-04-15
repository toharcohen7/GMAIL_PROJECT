FROM gcc:latest
 
COPY . /usr/src/mytest
 
WORKDIR /usr/src/mytest
 
RUN mkdir build
 
WORKDIR /usr/src/mytest/build
RUN apt-get update && apt-get install -y cmake
RUN cmake .. && make
 
CMD ["./runTest"]