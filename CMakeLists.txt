cmake_minimum_required(VERSION 3.14)
project(Gmail_Project)
 
# GoogleTest requires at least C++14
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
 
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)
# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)
 
# Test executable
add_executable(runTest test.cpp bloomFilter.cpp hashFunc.cpp immortalBloomFilter.cpp runProgram.cpp
              addUrlToIBF.cpp searchUrlInIBF.cpp initProgram.cpp)
target_link_libraries(runTest gtest_main)

# Main program executable
add_executable(runProg bloomFilter.cpp hashFunc.cpp main.cpp immortalBloomFilter.cpp runProgram.cpp
              addUrlToIBF.cpp searchUrlInIBF.cpp initProgram.cpp)
