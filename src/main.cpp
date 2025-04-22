#include "runProgram.hpp"         // runProgram class
#include "iCommand.hpp"          // iCommand class
#include "addUrlToIBF.hpp"      // addUrlToIBF class
#include "searchUrlInIBF.hpp"  // searchUrlInIBF class
#include "initProgram.hpp"    // initProgram class
#include <map>               // For std::map    
#include <iostream>         // cout, cin, endl


int main() {

    std::map<int, iCommand*> commands; // Map to store commands
    immortalBloomFilter *ibf = nullptr; // Pointer to the immortal bloom filter object

    commands[1] = new addUrlToIBF(); // Add URL command
    commands[2] = new searchUrlInIBF(); // Search URL command

    ibf = initProgram::createNewIBF(); // Create a new immortal bloom filter
    
    runProgram rp(commands, ibf); // Create runProgram object with commands
    rp.run();

    // Clean up dynamically allocated memory
    for (auto &command : commands) {
        delete command.second; // Delete each command object
    }
    commands.clear(); // Clear the map

    return 0;
}


