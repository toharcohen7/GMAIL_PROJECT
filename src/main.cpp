#include <map>                             // For std::map    
#include <iostream>                       // cout, cin, endl

#include "runProgram.hpp"               // runProgram class
#include "iCommand.hpp"                // iCommand class
#include "addUrlToIBF.hpp"            // addUrlToIBF class
#include "searchUrlInIBF.hpp"        // searchUrlInIBF class
#include "initProgram.hpp"          // initProgram class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "hashFunc.hpp"           // hashFunc class
#include "promptHandler.hpp"     // promptHandler class

// Helper functions implimetation
size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}

int main() {

    std::map<int, iCommand*> commands; // Map to store commands
    immortalBloomFilter *ibf = nullptr; // Pointer to the immortal bloom filter object
    std::vector<hashFunc> hashFunctions; // Vector to hold hash functions
    promptHandler consolePrompt; // Input handler for user input

    commands[1] = new addUrlToIBF(); // Add URL command
    commands[2] = new searchUrlInIBF(consolePrompt); // Search URL command

    ibf = initProgram::createNewIBF(hashFunctions, consolePrompt); // Create a new immortal bloom filter

    runProgram rp(commands, ibf, consolePrompt); // Create runProgram object with commands
    rp.run();

    // Clean up dynamically allocated memory
    for (auto &command : commands) {
        delete command.second; // Delete each command object
    }
    commands.clear(); // Clear the map

    return 0;
}


