#include <map>                            // For std::map    
#include <iostream>                      // cout, cin, endl
#include <string>                       // string 
#include "iCommand.hpp"                // iCommand class
#include "addUrlToIBF.hpp"            // addUrlToIBF class
#include "searchUrlInIBF.hpp"        // searchUrlInIBF class
#include "initProgram.hpp"          // initProgram class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "hashFunc.hpp"           // hashFunc class
#include "promptHandler.hpp"     // promptHandler class
#include "runProgram.hpp"
#include "deleteUrlFromIBF.hpp"

// Helper functions implimetation
size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}

int main() {

    std::map<std::string, iCommand*> commands; // Map to store commands
    immortalBloomFilter *ibf = nullptr; // Pointer to the immortal bloom filter object
    std::vector<hashFunc> hashFunctions; // Vector to hold hash functions
    promptHandler consolePrompt; // Input handler for user input

    commands["POST"] = new addUrlToIBF(consolePrompt); // Add URL command
    commands["GET"] = new searchUrlInIBF(consolePrompt); // Search URL command
    commands["DELETE"] = new deleteUrlFromIBF(consolePrompt); // Delete URL command

    ibf = initProgram::createNewIBF(hashFunctions, consolePrompt, consolePrompt); // Create a new immortal bloom filter

    runProgram rp(commands, ibf, consolePrompt, consolePrompt); // Create runProgram object with commands
    rp.run();

    // Clean up dynamically allocated memory
    for (auto &command : commands) {
        delete command.second; // Delete each command object
    }
    commands.clear(); // Clear the map

    return 0;
}


