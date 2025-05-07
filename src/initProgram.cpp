#include <sstream>                    // istringstream

#include "initProgram.hpp"          // initProgram class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "hashFunc.hpp"           // hashFunc class 

// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str);

// Function to check if the input values are valid for creating a new immortal bloom filter
static bool CheckInputCreation(const int &size, const std::vector<int> &hashcounts);

// Function to create a new immortal bloom filter
immortalBloomFilter *initProgram::createNewIBF(size_t ibfSize, std::vector<int> hashCounts, 
                                                std::vector<hashFunc> &hashFunctions) {
    // Check if the input values are valid
    if (!CheckInputCreation(ibfSize, hashCounts)) {
        throw std::runtime_error("Invalid input values for creating a new immortal bloom filter\n");
    }
                    
    auto runnerCounts = hashCounts.begin();     // Iterator for the hash counts
    auto runnerFuncs = hashFunctions.begin(); // Iterator for the hash functions


    // Set the hash count for each hash function
    while(runnerFuncs != hashFunctions.end())
    {
        // Set the hash count for each hash function
        runnerFuncs->setHashCount(static_cast<size_t>(*runnerCounts));
        ++runnerCounts;
        ++runnerFuncs;
    }
    
    // If there are more hash counts than hash functions, create new hash functions for the remaining counts
    while(runnerCounts != hashCounts.end()) 
    {
        // Create new hash functions for remaining counts
        std::cout << static_cast<size_t>(static_cast<size_t>(*runnerCounts)) << std::endl;
        hashFunctions.push_back(hashFunc(hasher, static_cast<size_t>(*runnerCounts))); 
        ++runnerCounts;
    }

    return new immortalBloomFilter(ibfSize, hashFunctions); // Create a new immortal bloom filter
}

static size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
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


runProgram *initProgram::createRunProgram(immortalBloomFilter *ibf) {
 
    return new runProgram(ibf); // Create a new runProgram object
}