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
#include "server.hpp" // server class


int main() {
    
    int port = 12346; // Port number for the server
    server myServer(port); // Create a server object with the specified port
    myServer.startServer(); // Start the server and listen for incoming connections

    return 0;
}


