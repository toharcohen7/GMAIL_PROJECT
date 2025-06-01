cmake_minimum_required(VERSION 3.14)
project(Gmail_Project)
 
# GoogleTest requires at least C++14
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pthread")
 
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)
 
# Test executable
add_executable(runTest
    src/blacklist/cpp/test.cpp
    src/blacklist/cpp/bloomFilter.cpp
    src/blacklist/cpp/hashFunc.cpp
    src/blacklist/cpp/immortalBloomFilter.cpp
    src/blacklist/cpp/runProgram.cpp
    src/blacklist/cpp/addUrlToIBF.cpp
    src/blacklist/cpp/searchUrlInIBF.cpp
    src/blacklist/cpp/initProgram.cpp
    src/blacklist/cpp/promptHandler.cpp
    src/blacklist/cpp/deleteUrlFromIBF.cpp
    src/blacklist/cpp/server.cpp
    src/blacklist/cpp/socketHandler.cpp)
target_link_libraries(runTest gtest_main pthread)

# Main program executable
add_executable(runServer
    src/blacklist/cpp/bloomFilter.cpp
    src/blacklist/cpp/hashFunc.cpp
    src/blacklist/cpp/main.cpp
    src/blacklist/cpp/immortalBloomFilter.cpp
    src/blacklist/cpp/runProgram.cpp
    src/blacklist/cpp/addUrlToIBF.cpp
    src/blacklist/cpp/searchUrlInIBF.cpp
    src/blacklist/cpp/initProgram.cpp
    src/blacklist/cpp/promptHandler.cpp
    src/blacklist/cpp/deleteUrlFromIBF.cpp
    src/blacklist/cpp/server.cpp
    src/blacklist/cpp/socketHandler.cpp)
    target_link_libraries(runServer pthread)