#include <sys/socket.h>    // For socket-related definitions
#include <netinet/in.h>   // For sockaddr_in
#include <arpa/inet.h>   // For inet_pton
#include <unistd.h>     // For close
#include <cstring>     // For memset
#include <string>     // For std::cout
#include <stdexcept> // For std::runtime_error

#include "socketHandler.hpp" // socketHandler class

socketHandler::socketHandler(int severSocket) {
    // Accept a client connection
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    int client_sock = accept(severSocket, (struct sockaddr *) &client_sin,  &addr_len);

    // Check if the client socket is valid
    if (client_sock < 0) {
        throw std::runtime_error("error accepting a socket\n");
    }

    m_clientSocket = client_sock; // Store the client socket
}

socketHandler::~socketHandler() {
    if (m_clientSocket != -1) {
        close(m_clientSocket); // Close the client socket
    }
}

std::string socketHandler::getInput() {
    
    // receive the client's message
    char buffer[4096] = {0}; // Buffer to store the received data
    int expected_data_len = sizeof(buffer);
    int read_bytes = recv(m_clientSocket, buffer, expected_data_len, 0);

    // check for errors
    if (read_bytes < 0) { 
        throw std::runtime_error("error receiving data\n");
    }

    return std::string(buffer); // Convert the buffer to a string
}

iOutputHandler &socketHandler::sendOutput(std::string output) {
    // Send the output to the client socket
    int sent_bytes = send(m_clientSocket, output.c_str(), output.size(), 0);
    if (sent_bytes < 0) {
        throw std::runtime_error("error sending data\n");
    }
    return *this; // Return the current object
}

iOutputHandler &socketHandler::operator<<(std::string output) {

    return sendOutput(output); // Call the sendOutput function
}
