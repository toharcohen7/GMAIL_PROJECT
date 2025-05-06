/*******************************************************************************
 * @file socketHandler.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef SOCKETHANDLER_HEADER
#define SOCKETHANDLER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 ******************************************************************************/

#include <sys/socket.h> // For SOCK_STREAM and socket-related definitions

#include "iInputHandler.hpp" // iInputHandler class
#include "iOutputHandler.hpp" // iOutputHandler class


/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class socketHandler : public iInputHandler , public iOutputHandler
{
    const int m_port;            // Port number for the server
    const int m_socketType;     // Socket type (TCP or UDP)
    const int m_addressFamily; // Address family (IPv4 or IPv6)

    int m_clientSocket; // Socket for the client connection
    int m_socket;            // Socket to listen for incoming connections

public:
/*******************************************************************************
 * @brief Constructor for the socketHandler class.
 * @details This constructor initializes the socketHandler object.
 * @param port Port number for the server.
 * @param socketType Socket type (TCP or UDP).
 * @param addressFamily Address family (IPv4 or IPv6).
 * @param numToListen Number of connections to listen for.
 ******************************************************************************/
    socketHandler(int port, int socketType = SOCK_STREAM, int addressFamily = AF_INET, size_t numToListen = 5);

/*******************************************************************************
 * @brief Destructor for the socketHandler class.
 * @details This destructor cleans up the resources used by the socketHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 ******************************************************************************/
    ~socketHandler();

/*******************************************************************************
 * @brief Accepts a client connection.
 * @details This function accepts a client connection and sets the client socket.
 * @note This function is waiting for a client connection.
*******************************************************************************/
    void acceptClient();

/*******************************************************************************
 * @brief Gets the user input from the socket.
 * @details This function is implemented to get user input from the socket.
 * @return The user input as a string.
 * @note This function overrides the pure virtual function from the iInputHandler class.
 ******************************************************************************/
    virtual std::string getInput() override;

/*******************************************************************************
 * @brief Sends the output to the client socket.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the client socket.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 * @note undefined behavior if the socket is not connected.
 ******************************************************************************/
    virtual iOutputHandler &sendOutput(std::string output) override;

/*******************************************************************************
 * @brief Sends the output to the client socket.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the client socket.
 * This function implements the << operator to send output to the client socket.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 * @note undefined behavior if the socket is not connected.
 ******************************************************************************/
    virtual iOutputHandler &operator<<(std::string output) override;

};

#endif /* SOCKETHANDLER_HEADER */