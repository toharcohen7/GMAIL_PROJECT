#include <string>                    // string 
#include "initProgram.hpp"          // initProgram class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "hashFunc.hpp"           // hashFunc class
#include "runProgram.hpp"        // runProgram class
#include "server.hpp"           // server class

enum inputArguments {
    MAIN_FILE = 0,
    PORT_NUMBER = 1,
    BLOOM_FILTER_SIZE = 2,
    // Hash Count Start...
};

int main(int argc, char *argv[]) {
    

    if (argc < 4) { // main file name + port number + bloom filter size + at least one hash count
        throw std::runtime_error("not enough arguments\n");
        return 1;
    }

    std::vector<int> hashCounts; // Vector to hold hash counts
    for (int i = 3; i < argc; ++i) {

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

    return 0;
}
