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

#include "iInputHandler.hpp" // iInputHandler class
#include "iOutputHandler.hpp" // iOutputHandler class
        
/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class socketHandler : public iInputHandler, public iOutputHandler
{

public:
/*******************************************************************************
 * @brief Constructor for the socketHandler class.
 * @details This constructor initializes the socketHandler object.
 * @note This constructor is default, meaning that it does not perform any specific initialization.
 ******************************************************************************/
    socketHandler() = default;

/*******************************************************************************
 * @brief Destructor for the socketHandler class.
 * @details This destructor cleans up the resources used by the socketHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 ******************************************************************************/
    ~socketHandler() = default;

/*******************************************************************************
 * @brief Gets the user input from the socket.
 * @details This function is implemented to get user input from the socket.
 * @return The user input as a string.
 * @note This function overrides the pure virtual function from the iInputHandler class.
 ******************************************************************************/
    virtual std::string getInput() override;

/*******************************************************************************
 * @brief Sends the output to the socket.
 * @param output The output to be sent.
 * @details This function is implemented to send socket to the console.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 ******************************************************************************/
    virtual iOutputHandler &sendOutput(std::string output) override;

/*******************************************************************************
 * @brief Sends the output to the socket.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the socket.
 * This function implements the << operator to send output to the socket.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 ******************************************************************************/
    virtual iOutputHandler &operator<<(std::string output) override;
};

#endif /* SOCKETHANDLER_HEADER */