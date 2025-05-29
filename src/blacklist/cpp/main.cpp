#include <string>                    // string 
#include "../hpp/initProgram.hpp"          // initProgram class
#include "../hpp/immortalBloomFilter.hpp" // immortalBloomFilter class
#include "../hpp/hashFunc.hpp"           // hashFunc class
#include "../hpp/runProgram.hpp"        // runProgram class
#include "../hpp/server.hpp"           // server class

#define SUCCESS 0
#define ERROR 1 
#define MIN_ARGUMENTS 4        // Minimum number of arguments required
#define MAX_PORT_NUMBER 65535 // Maximum port number
#define MIN_PORT_NUMBER 1024 // Minimum port number

static bool isValidInut(int argc, char *argv[]);

enum inputArguments {
    MAIN_FILE = 0,
    PORT_NUMBER = 1,
    BLOOM_FILTER_SIZE = 2,
    FIRST_HASH_COUNT = 3,
    // Hash Count...
};

int main(int argc, char *argv[]) {
    
    if(false == isValidInut(argc, argv)) { // Validate input arguments
        return ERROR;
    }

    std::vector<int> hashCounts; // Vector to hold hash counts
    for (int i = FIRST_HASH_COUNT; i < argc; ++i) {

        hashCounts.push_back(std::stoi(std::string(argv[i]))); // Convert command line arguments to integers
    }    
    
    // Vector to hold hash functions - optinal to add more hash functions
    std::vector<hashFunc> hashFunctions; 
    // Create a new immortal bloom filter
    immortalBloomFilter *ibf = initProgram::createNewIBF(std::stoi(argv[BLOOM_FILTER_SIZE]), 
                                                        hashCounts, hashFunctions); 

    runProgram *rp = initProgram::createRunProgram(ibf); // Create runProgram object
                                    
    server myServer(std::stoi(argv[PORT_NUMBER]), *rp); // Create a server object with the specified port
    myServer.startServer(); // Start the server and listen for incoming connections

    delete rp; // Clean up the runProgram object
    delete ibf; // Clean up the immortal bloom filter object

    return SUCCESS;
}

static bool isValidInut(int argc, char *argv[]) {

    // main file name + port number + bloom filter size + at least one hash count
    if (argc < MIN_ARGUMENTS) { 
        return false; // Not enough arguments
    }

    if (MIN_PORT_NUMBER > std::stoi(std::string(argv[PORT_NUMBER])) || 
        MAX_PORT_NUMBER < std::stoi(std::string(argv[PORT_NUMBER])) ) {
        return false; // Invalid port number
    }

    if (0 >= std::stoi(std::string(argv[BLOOM_FILTER_SIZE]))) {
        return false; // Invalid bloom filter size
    }

    for (int i = FIRST_HASH_COUNT; i < argc; ++i) {

        // Check if hash count is valid
        if (0 >= std::stoi(std::string(argv[i]))) { 

            return false; // Invalid hash count
        }
    }

    return true; // All input arguments are valid
}