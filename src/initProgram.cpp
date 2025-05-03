#include <sstream>                    // istringstream

#include "initProgram.hpp"          // initProgram class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "hashFunc.hpp"           // hashFunc class
#include "iInputHandler.hpp"     // iInputHandler class
#include "iOutputHandler.hpp"   // iOutputHandler class 

// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str);

// Function to get user input for creating a new immortal bloom filter
static bool getInputCreation(iInputHandler &inputStream, int &size, std::vector<int> &hashcounts);

// Function to check if the input values are valid for creating a new immortal bloom filter
static bool CheckInputCreation(const int &size, const std::vector<int> &hashcounts);

// Function to create a new immortal bloom filter
immortalBloomFilter *initProgram::createNewIBF(std::vector<hashFunc> &hashFunctions, iInputHandler &inputStream,iOutputHandler &outputStream) {

    int size = 0;
    std::vector<int> hashCounts; // Vector to hold hash counts

    // Get user input for size and hash counts, until valid input is provided
    while (true)
    {
        if (getInputCreation(inputStream, size, hashCounts)) {
            break; 
        }
        else
        {
            outputStream <<"400 Bad Request\n";
        }
        hashCounts.clear(); // Clear the hash counts vector for the next input attempt
    }

    size_t runner = 0;
    
    // Set the hash count for each hash function
    for (; runner < hashFunctions.size() && runner < hashCounts.size(); ++runner)
    {
        // Set the hash count for each hash function
        hashFunctions[runner].setHashCount(static_cast<size_t>(hashCounts[runner]));
    }
    
    // If there are more hash counts than hash functions, create new hash functions for the remaining counts
    for (; runner < hashCounts.size(); ++runner)
    {
        // Create new hash functions for remaining counts
        hashFunctions.push_back(hashFunc(hasher, static_cast<size_t>(hashCounts[runner]))); 
    }

    return new immortalBloomFilter(size, hashFunctions); // Create a new immortal bloom filter
}

static size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}

static bool getInputCreation(iInputHandler &inputStream, int &size, std::vector<int> &hashcounts) {
    
    std::string extra;  // For checking if there are any extra characters after the integers
    std::string line;

    line = inputStream.getInput(); // Get user input
    std::istringstream iss(line);

    // Check if the first integer are valid
    if (!(iss >> size)) {
        return false;
    }

    std::istream::pos_type pos = iss.tellg();

    int temp = 0;
    while (iss >> temp) {
        hashcounts.push_back(temp);
         pos = iss.tellg();
    }

    iss.clear();    // Clear the fail state of the stream
    iss.seekg(pos); // Reset the stream position to the last read position

    if (iss >> extra) { 
        return false; // Check if there are any extra characters after the integers
    } 

    return CheckInputCreation(size, hashcounts); // Check if the inputs are valid
}

static bool CheckInputCreation(const int &size, const std::vector<int> &hashcounts) {
    
    if (0 >= size || 0 == hashcounts.size()) {
        return false; // the size must be greater than 0
    }
    
    for (size_t i = 0; i < hashcounts.size(); ++i) {
        if (hashcounts[i] <= 0) {
            return false; // hash counts must be greater than 0
        }
    }

    return true; // All inputs are valid
}
