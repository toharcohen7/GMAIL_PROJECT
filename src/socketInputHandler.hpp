/*******************************************************************************
 * @file socketInputHandler.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef SOCKETINPUTHANDLER_HEADER
#define SOCKETINPUTHANDLER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 ******************************************************************************/

#include <sys/socket.h> // For SOCK_STREAM and socket-related definitions

#include "iInputHandler.hpp" // iInputHandler class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class socketInputHandler : public iInputHandler
{
    const int m_port;            // Port number for the server
    const int m_socketType;     // Socket type (TCP or UDP)
    const int m_addressFamily; // Address family (IPv4 or IPv6)

    int latestClientSocket; // Socket for the client connection

public:
/*******************************************************************************
 * @brief Constructor for the socketInputHandler class.
 * @details This constructor initializes the socketInputHandler object.
 * @note This constructor is default, meaning that it does not perform any specific initialization.
 ******************************************************************************/
    socketInputHandler(int port, int socketType = SOCK_STREAM, int addressFamily = AF_INET);

/*******************************************************************************
 * @brief Destructor for the socketInputHandler class.
 * @details This destructor cleans up the resources used by the socketInputHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 ******************************************************************************/
    ~socketInputHandler() = default;

/*******************************************************************************
 * @brief Gets the user input from the socket.
 * @details This function is implemented to get user input from the socket.
 * @return The user input as a string.
 * @note This function overrides the pure virtual function from the iInputHandler class.
 ******************************************************************************/
    virtual std::string getInput() override;

/*******************************************************************************
 * @brief Gets the latest client socket.
 * @details This function returns the latest client socket.
 * @return The latest client socket as an integer.
 * @note nagative return value indicates an error.
 ******************************************************************************/
    int getLatestClientSocket() const;

};

#endif /* SOCKETINPUTHANDLER_HEADER */