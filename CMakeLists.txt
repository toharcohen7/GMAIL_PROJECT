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
    src/test.cpp
    src/bloomFilter.cpp
    src/hashFunc.cpp
    src/immortalBloomFilter.cpp
    src/runProgram.cpp
    src/addUrlToIBF.cpp
    src/searchUrlInIBF.cpp
    src/initProgram.cpp
    src/promptHandler.cpp
    src/deleteUrlFromIBF.cpp
    src/server.cpp
    src/socketHandler.cpp)
target_link_libraries(runTest gtest_main pthread)

# Main program executable
add_executable(runServer
    src/bloomFilter.cpp
    src/hashFunc.cpp
    src/main.cpp
    src/immortalBloomFilter.cpp
    src/runProgram.cpp
    src/addUrlToIBF.cpp
    src/searchUrlInIBF.cpp
    src/initProgram.cpp
    src/promptHandler.cpp
    src/deleteUrlFromIBF.cpp
    src/server.cpp
    src/socketHandler.cpp)
    target_link_libraries(runServer pthread)