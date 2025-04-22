# Gmail_Project

## Overview

This project implements a Bloom Filter and related functionality in C++.  
It includes both a main program (`runProg`) and a test suite (`runTest`) using GoogleTest.

## Building with Docker

The project is set up to build and run inside a Docker container using GCC and CMake.

### Build the Docker Image

From the project root directory, run:

```sh
docker build -t gmail_project .
```

## Running the Program

### Interactive Main Program

To run the main program interactively (recommended):

```sh
docker run -it gmail_project ./runProg
```

- The `-it` flag attaches an interactive terminal, allowing you to provide input to the program.

### Running the Test Suite

To run the GoogleTest-based test suite:

```sh
docker run gmail_project ./runTest
```

- This will execute all unit tests and print the results.

## Default Run Behavior

By default, when you run the Docker container **without specifying a command**, it will execute the main program:

```sh
docker run -it gmail_project
```

This is equivalent to:

```sh
docker run -it gmail_project ./runProg
```

If you want to run the test suite instead, simply specify `./runTest` as the command:

```sh
docker run gmail_project ./runTest
```

**Note:**  
- Always use `-it` when running the main program to enable interactive input.
- You do not need `-it` when running the tests.

## Notes

- The Docker image builds both the main program (`runProg`) and the test suite (`runTest`).
- You can override the command to run any executable built in the image.
- For interactive use, always use the `-it` flags with Docker.

## Project Structure

- `main.cpp` — Entry point for the main program.
- `test.cpp` — Contains GoogleTest unit tests.
- `CMakeLists.txt` — CMake build configuration.
- `Dockerfile` — Docker build instructions.
- Other `.cpp` and `.hpp` files — Project source code.

## Example Commands

Build the image:
```sh
docker build -t gmail_project .
```

Run the main program interactively:
```sh
docker run -it gmail_project ./runProg
```

Run the tests:
```sh
docker run gmail_project ./runTest
```