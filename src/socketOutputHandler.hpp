/*******************************************************************************
 * @file socketOutputHandler.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef SOCKETOUTPUTHANDLER_HEADER
#define SOCKETOUTPUTHANDLER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 ******************************************************************************/

#include <sys/socket.h> // For SOCK_STREAM and socket-related definitions

#include "iOutputHandler.hpp" // iOutputHandler class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class socketOutputHandler : public iOutputHandler
{
    const int m_clientSocket; // Socket for the sending output

public:
/*******************************************************************************
 * @brief Constructor for the socketOutputHandler class.
 * @details This constructor initializes the socketOutputHandler object.
 * @note This constructor is default, meaning that it does not perform any specific initialization.
 ******************************************************************************/
    socketOutputHandler(int clientSocket);

/*******************************************************************************
 * @brief Destructor for the socketOutputHandler class.
 * @details This destructor cleans up the resources used by the socketOutputHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 ******************************************************************************/
    ~socketOutputHandler() = default;

/*******************************************************************************
 * @brief Sends the output to the client socket.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the client socket.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 ******************************************************************************/
virtual iOutputHandler &sendOutput(std::string output) override;

/*******************************************************************************
 * @brief Sends the output to the client socket.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the client socket.
 * This function implements the << operator to send output to the client socket.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 ******************************************************************************/
    virtual iOutputHandler &operator<<(std::string output) override;

};

#endif /* SOCKETOUTPUTHANDLER_HEADER */