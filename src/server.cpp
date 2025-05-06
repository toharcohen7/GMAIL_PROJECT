#include <sys/socket.h>   // For socket-related definitions
#include <netinet/in.h>  // For sockaddr_in
#include <arpa/inet.h>  // For inet_pton
#include <unistd.h>    // For close
#include <cstring>    // For memset
#include <string>    // For std::cout

#include <stdexcept> // For std::runtime_error

#include "socketHandler.hpp" // socketHandler class
#include "server.hpp" // server class

static size_t hasher(const std::string &str);

server::server(int port, int socketType, int addressFamily, size_t numToListen) {
    // Create a socket
    m_serverSocket = socket(addressFamily, socketType, 0);
    if (m_serverSocket < 0) {
        throw std::runtime_error("Failed to create socket");
    }

    // Set the socket to reuse the address
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(port);

    // Bind the socket to the specified port
    if (bind(m_serverSocket, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        close(m_serverSocket);
        throw std::runtime_error("Failed to bind socket\n");
    }

    // Set the socket to listen for incoming connections
    if (listen(m_serverSocket, numToListen) < 0) {
        throw std::runtime_error("error listening to a socket\n");
    }
}

server::~server() {
    close(m_serverSocket); // Close the server socket
}

void server::startServer() {

    std::map<std::string, iCommand*> commands; // Map to store commands
    immortalBloomFilter *ibf = nullptr; // Pointer to the immortal bloom filter object
    std::vector<hashFunc> hashFunctions; // Vector to hold hash functions
    socketHandler socketPrompt(m_serverSocket); // Input handler for user input

    hashFunctions.push_back(hashFunc(hasher, 1)); // Add a default hash function
    hashFunctions.push_back(hashFunc(hasher, 2)); // Add a default hash function

    commands["POST"] = new addUrlToIBF(socketPrompt); // Add URL command
    commands["GET"] = new searchUrlInIBF(socketPrompt); // Search URL command
    commands["DELETE"] = new deleteUrlFromIBF(socketPrompt); // Delete URL command

    ibf = new immortalBloomFilter(8 ,hashFunctions); // Create a new immortal bloom filter

    runProgram rp(commands, ibf, socketPrompt, socketPrompt); // Create runProgram object with commands
    rp.run();

    // Clean up dynamically allocated memory
    for (auto &command : commands) {
        delete command.second; // Delete each command object
    }
    commands.clear(); // Clear the map
}

static size_t hasher(const std::string &str) {
    return std::hash<std::string>()(str);
}