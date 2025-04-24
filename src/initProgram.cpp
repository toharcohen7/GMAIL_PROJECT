#include <iostream>
#include <sstream>

#include "initProgram.hpp"

// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str);

// Function to get user input for creating a new immortal bloom filter
static bool getInputCreation(std::istream &inputStream, int &size, std::vector<int> &hashcounts);

// Function to check if the input values are valid for creating a new immortal bloom filter
static bool CheckInputCreation(const int &size, const std::vector<int> &hashcounts);



// // Function to create a new immortal bloom filter
// immortalBloomFilter *initProgram::createNewIBF(std::istream &inputStream) {
//     std::vector<hashFunc> hashFunctions;
//     size_t size = 0;
//     size_t hashCount1 = 0;
//     size_t hashCount2 = 0;

//     // Get user input for size and hash counts, until valid input is provided
//     while (true)
//     {
//         if (getInputCreation(inputStream, size, hashCount1, hashCount2)) {
//             break; 
//         }
//     }

//     // Create the first hash function with the specified count
//     hashFunctions.push_back(hashFunc(hasher, hashCount1));

//     // Create the second hash function with the specified count if it's greater than 0
//     // This is optional, as the user may choose to use only one hash function
//     if (hashCount2 > 0) {
//         hashFunctions.push_back(hashFunc(hasher, hashCount2));
//     } 

//     return new immortalBloomFilter(size, hashFunctions); // Create a new immortal bloom filter
// }

// // Helper functions implimetation
// size_t hasher(const std::string &str) {
//     return std::hash<std::string>()(str);
// }

// static bool getInputCreation(std::istream &inputStream, size_t &size, size_t &hashcount1, size_t &hashcount2) {
//     std::string line;
//     std::getline(inputStream, line);
//     std::istringstream iss(line);

//     std::string extra;  // For checking if there are any extra characters after the integers
//     char ch;            // For checking if the third input is a character

//     // Check if the first two integers are valid
//     if (!(iss >> size >> hashcount1)) {
//         return false;
//     }

//     // Check if the third integer is valid (optional)
//     // If the third integer is not provided, set it to 0
//     std::istream::pos_type pos = iss.tellg(); // Get the current position in the stream

//     // If successfully check if there extra characters after the thired integer
//     if (iss >> hashcount2) {
//         if (iss >> extra) { return false; } // Check if there are any extra characters after the third integer

//     // If failed to read the third integer, check if there are any extra characters after the second integer
//     } else {

//         iss.clear();    // Clear the fail state of the stream
//         iss.seekg(pos); // Reset the stream position to the last read position

//         if (iss >> ch) { return false; } // Check if there are any extra characters after the second integer
//         hashcount2 = 0; 
//     }

//     return CheckInputCreation(size, hashcount1, hashcount2); // Check if the inputs are valid
// }

// static bool CheckInputCreation(const size_t &size, const size_t &hashcount1, const size_t &hashcount2) {

//     (void)hashcount2; // Suppress unused variable warning

//     if (size <= 0 || hashcount1 <= 0) {
//         return false; // a, b must be greater than 0, c must be non-negative
//     }

//     return true; // All inputs are valid
// }

// Helper functions implimetation
size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}

// Function to create a new immortal bloom filter
immortalBloomFilter *initProgram::createNewIBF(std::vector<hashFunc> &hashFunctions, std::istream &inputStream) {

    int size = 0;
    std::vector<int> hashCounts; // Vector to hold hash counts

    // Get user input for size and hash counts, until valid input is provided
    while (true)
    {
        if (getInputCreation(inputStream, size, hashCounts)) {
            break; 
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

static bool getInputCreation(std::istream &inputStream, int &size, std::vector<int> &hashcounts) {
    
    std::string extra;  // For checking if there are any extra characters after the integers
    std::string line;

    std::getline(inputStream, line);
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
