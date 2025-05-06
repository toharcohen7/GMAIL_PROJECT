#include <sys/socket.h>   // For socket-related definitions
#include <netinet/in.h>  // For sockaddr_in
#include <arpa/inet.h>  // For inet_pton
#include <unistd.h>    // For close
#include <cstring>    // For memset
#include <string>    // For std::cout

#include <stdexcept> // For std::runtime_error

#include "socketHandler.hpp" // socketHandler class

socketHandler::socketHandler(int port, int socketType, int addressFamily, size_t numToListen)
    : m_port(port), m_socketType(socketType), m_addressFamily(addressFamily), m_clientSocket(-1) // Initialize members
{
     // Create a socket
    int m_sock = socket(m_addressFamily, m_socketType, 0);
    if (m_sock < 0) {
        throw std::runtime_error("Failed to create socket");
    }

    // Set the socket to reuse the address
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(m_port);

    // Bind the socket to the specified port
    if (bind(m_sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        close(m_sock);
        throw std::runtime_error("Failed to bind socket\n");
    }

    // Set the socket to listen for incoming connections
    if (listen(m_sock, numToListen) < 0) {
        perror("error listening to a socket\n");
    }
}

socketHandler::~socketHandler() {
    if (m_clientSocket != -1) {
        close(m_clientSocket); // Close the client socket
    }
    close(m_socket); // Close the server socket
}

void socketHandler::acceptClient() {

    // Accept a client connection
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    int client_sock = accept(m_socket, (struct sockaddr *) &client_sin,  &addr_len);

    // Check if the client socket is valid
    if (client_sock < 0) {
       perror("error accepting a socket\n");
       return;
    }

    m_clientSocket = client_sock; // Store the client socket
}

std::string socketHandler::getInput() {
    
    // receive the client's message
    char buffer[4096];
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(m_clientSocket, buffer, expected_data_len, 0);

    // check for errors
    if (read_bytes < 0) { 
        perror("error receiving data\n");
    }

    return std::string(buffer); // Convert the buffer to a string
}

iOutputHandler &socketHandler::sendOutput(std::string output) {
    // Send the output to the client socket
    int sent_bytes = send(m_clientSocket, output.c_str(), output.size(), 0);
    if (sent_bytes < 0) {
        perror("error sending data\n");
    }
    return *this; // Return the current object
}

iOutputHandler &socketHandler::operator<<(std::string output) {

    return sendOutput(output); // Call the sendOutput function
}
