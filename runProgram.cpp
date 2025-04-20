/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/
#include <iostream>
#include <string>          // string
#include <vector>         // vector

#include "runProgram.hpp"
#include "immortalBloomFilter.hpp"
#include "hashFunc.hpp"    // hashFunc class
#include <sstream> // istringstream


/*******************************************************************************
 *                        SIGNATURES OF HELP FUNCTIONS                         *
 * ****************************************************************************/

// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str);

// Function to create a new immortal bloom filter
static immortalBloomFilter *createNewIBF(std::istream &inputStream);

// Function to get user input for creating a new immortal bloom filter
static bool getInputCreation(std::istream &inputStream, size_t &size, size_t &hashcount1, size_t &hashcount2);

// Function to check if the input values are valid for creating a new immortal bloom filter
static bool CheckInputCreation(const size_t &size, const size_t &hashcount1, const size_t &hashcount2);

// Function to get user input for the operation
static bool getInputOperation(std::istream &inputStream, int &operationNum, std::string &url);

// Function to run the operations based on user input
static void runOperations(immortalBloomFilter *ibf, std::ostream &outputStream, std::istream &inputStream);


/*******************************************************************************
 *                               IMPLEMANTATIONS                               *
 * ****************************************************************************/

runProgram::runProgram(std::ostream &outputStream, std::istream &inputStream)
    : m_outputStream(outputStream), m_inputStream(inputStream) {
        m_ibf = createNewIBF(inputStream); // Create a new immortal bloom filter
}

runProgram::~runProgram() {
    // empty destructor
}

void runProgram::run() {
    
    while (true) {
        runOperations(m_ibf, m_outputStream, m_inputStream); // Run the operations based on user input
    }
}

/*******************************************************************************
 *                               HELP FUNCTIONS                                *
 * ****************************************************************************/

// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}

// Function to create a new immortal bloom filter
static immortalBloomFilter *createNewIBF(std::istream &inputStream) {
    size_t size = 0;
    size_t hashCount1 = 0;
    size_t hashCount2 = 0;

    // Get user input for size and hash counts, until valid input is provided
    while (true)
    {
        if (getInputCreation(inputStream, size, hashCount1, hashCount2)) {
            break; 
        }
        std::cout << "Invalid input." << std::endl; // TODO: REMOVE THIS LINE
    }
    
    // Create a vector of hash functions
    std::vector<hashFunc> hashFunctions;

    // Create the first hash function with the specified count
    hashFunc hf1(hasher, hashCount1);
    hashFunctions.push_back(hf1);

    // Create the second hash function with the specified count if it's greater than 0
    // This is optional, as the user may choose to use only one hash function
    if (hashCount2 > 0) {
        hashFunc hf2(hasher, hashCount2);
        hashFunctions.push_back(hf2);
    } 

    return new immortalBloomFilter(size, hashFunctions); // Create a new immortal bloom filter
}

// Function to get user input for creating a new immortal bloom filter
static bool getInputCreation(std::istream &inputStream, size_t &size, size_t &hashcount1, size_t &hashcount2) {

    std::string line;
    std::getline(inputStream, line);
    std::istringstream iss(line);

    std::string extra;  // For checking if there are any extra characters after the integers
    char ch;            // For checking if the third input is a character

    // Check if the first two integers are valid
    if (!(iss >> size >> hashcount1)) {
        return false;
    }
    
    // Check if the third integer is valid (optional)
    // If the third integer is not provided, set it to 0
    std::istream::pos_type pos = iss.tellg(); // Get the current position in the stream

    // If successfully check if there extra characters after the thired integer
    if (iss >> hashcount2) {
        if (iss >> extra) { return false; } // Check if there are any extra characters after the third integer
    
    // If failed to read the third integer, check if there are any extra characters after the second integer
    } else {
        
        iss.clear();    // Clear the fail state of the stream
        iss.seekg(pos); // Reset the stream position to the last read position

        if (iss >> ch) { return false; } // Check if there are any extra characters after the second integer
        hashcount2 = 0; // Set c to 0 if not provided
    }

    return CheckInputCreation(size, hashcount1, hashcount2); // Check if the inputs are valid
}

// Function to check if the input values are valid for creating a new immortal bloom filter
static bool CheckInputCreation(const size_t &size, const size_t &hashcount1, const size_t &hashcount2) {
    
    (void)hashcount2; // Suppress unused variable warning

    if (size <= 0 || hashcount1 <= 0) {
        return false; // a, b must be greater than 0, c must be non-negative
    }

    return true; // All inputs are valid
}

// Function to get user input for the operation
static bool getInputOperation(std::istream &inputStream, int &operationNum, std::string &url) {
    std::cout << "Enter a number followed by a word: ";

    std::string line; 
    std::getline(inputStream, line);

    std::istringstream iss(line);

    // check if the first part is a valid integer
    if (!(iss >> operationNum)) {
        return false;
    }

    // check if the second part is a valid word
    if (!(iss >> url)) {
        return false;
    }

    // Check if there are any extra characters after the word
    std::string extra;
    if (iss >> extra) {
        return false;
    }

    return true;
}

// Function to run the operations based on user input
static void runOperations(immortalBloomFilter *ibf, std::ostream &outputStream, 
                          std::istream &inputStream) { // TODO: change prints and orginaze the code

    int operationNum = 0;
    std::string url;

    // Get user input for the operation until valid input is provided
    while (true) {
        if (getInputOperation(inputStream, operationNum, url)) {
            break; // Valid input provided
        }
        outputStream << "Invalid input." << std::endl; // TODO: REMOVE THIS LINE
    }

    switch (operationNum) {
        case 1:
            ibf->add(url);
            break;
        case 2:
            if (ibf->isContains(url)) {
                outputStream << "The URL is in the bloom filter." << std::endl;

                if (ibf->isInBlackList(url)) {
                    outputStream << "The URL is in the blacklist." << std::endl;
                } else {
                    outputStream << "The URL is not in the blacklist." << std::endl;
                }

            } else {
                outputStream << "The URL is not in the bloom filter." << std::endl;
            }
            break;
        default:
            outputStream << "Invalid operation number." << std::endl;
            break;
    }
}

