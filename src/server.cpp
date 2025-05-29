#include <sys/socket.h>     // For socket-related definitions
#include <netinet/in.h>    // For sockaddr_in
#include <arpa/inet.h>    // For inet_pton
#include <unistd.h>      // For close
#include <cstring>      // For memset
#include <string>      // For std::cout
#include <stdexcept>  // For std::runtime_error
#include <thread>    // For threads

#include "socketHandler.hpp" // socketHandler class
#include "server.hpp"       // server class
#include "iRunnable.hpp"   // iRunnable class

static void threadFunction(iRunnable &runnable, int clientSocket);

server::server(int port, iRunnable &runnable, int socketType,
                 int addressFamily, size_t numToListen) : m_runnable(runnable) {
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

    while (true)
    {
        int clientSocket = -1; // Initialize clientSocket to -1

        try
        {
            // Accept a connection on the server socket
            clientSocket = socketHandler::acceptConnection(m_serverSocket); 
        }
        catch(const std::exception& e) 
        {
            continue; // If an error occurs while accepting a connection, continue to the next iteration
        }
        
        std::thread workerThread(threadFunction, std::ref(m_runnable), std::ref(clientSocket)); // Create a thread to run the program
        workerThread.detach(); // Detach the thread to allow it to run independently 
    }  
}

static void threadFunction(iRunnable &runnable, int clientSocket) {

    socketHandler socketPrompt(clientSocket);

    try 
    {
        runnable.run(socketPrompt, socketPrompt); // Run the program with the socket handler
    } catch (const std::exception &e) 
    {
        // do nothing
    }
}

    
