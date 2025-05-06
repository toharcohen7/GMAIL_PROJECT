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
    int m_clientSocket; // Socket for the client connection

public:
/*******************************************************************************
 * @brief Constructor for the socketHandler class.
 * @details This constructor initializes the socketHandler object.
 * @param severSocket The server socket to accept client connections.
 * @note This constructor is blocking, meaning that it will wait for a client connection.
 ******************************************************************************/
    socketHandler(int severSocket);

/*******************************************************************************
 * @brief Destructor for the socketHandler class.
 * @details This destructor cleans up the resources used by the socketHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 ******************************************************************************/
    ~socketHandler();

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