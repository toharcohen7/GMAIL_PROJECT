FROM gcc:latest
 
COPY . /usr/src/mytest
 
WORKDIR /usr/src/mytest
 
RUN mkdir build
 
WORKDIR /usr/src/mytest/build
RUN apt-get update && apt-get install -y cmake python3
RUN cmake .. && make

# Set entrypoint so user can choose what to run
ENTRYPOINT []

# Default command to run the test
CMD ["./runProg"]