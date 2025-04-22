#include "runProgram.hpp" // runProgram class
#include "iCommand.hpp" // iCommand class
#include "addUrlToIBF.hpp" // addUrlToIBF class
#include "searchUrlInIBF.hpp" // searchUrlInIBF class

#include <iostream>
#include <map> // For std::map    

#include <iostream>                       // cout, cin, endl            //
#include <string>                        // string                     //
#include <vector>                       // vector                     //
#include <sstream>                     // istringstream              //


// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str);

// Function to create a new immortal bloom filter and initialize the hash functions
static immortalBloomFilter *createNewIBF(std::vector<hashFunc> &hashFunctions, std::istream &inputStream = std::cin);

// Function to get user input for creating a new immortal bloom filter
static bool getInputCreation(std::istream &inputStream, size_t &size, size_t &hashcount1, size_t &hashcount2);

// Function to check if the input values are valid for creating a new immortal bloom filter
static bool CheckInputCreation(const size_t &size, const size_t &hashcount1, const size_t &hashcount2);

int main() {

    std::map<int, iCommand*> commands; // Map to store commands
    std::vector<hashFunc> hashFunctions; // Vector to store hash functions
    immortalBloomFilter *ibf = nullptr; // Pointer to the immortal bloom filter object

    commands[1] = new addUrlToIBF(); // Add URL command
    commands[2] = new searchUrlInIBF(); // Search URL command

    ibf = createNewIBF(hashFunctions); // Create a new immortal bloom filter
    
    runProgram rp(commands, ibf); // Create runProgram object with commands
    rp.run();

    // Clean up dynamically allocated memory
    for (auto &command : commands) {
        delete command.second; // Delete each command object
    }
    commands.clear(); // Clear the map

    return 0;
}

// Hash function to be used in the hashFunc class
static size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}

// Function to create a new immortal bloom filter
static immortalBloomFilter *createNewIBF(std::vector<hashFunc> &hashFunctions, std::istream &inputStream) {
    size_t size = 0;
    size_t hashCount1 = 0;
    size_t hashCount2 = 0;

    // Get user input for size and hash counts, until valid input is provided
    while (true)
    {
        if (getInputCreation(inputStream, size, hashCount1, hashCount2)) {
            break; 
        }
    }

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

