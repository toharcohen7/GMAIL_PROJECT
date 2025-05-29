/*******************************************************************************
 * @file iOutputHandler.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef IOUTPUTHANDLER_HEADER
#define IOUTPUTHANDLER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/
#include <string>

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class iOutputHandler
{
    public:

/*******************************************************************************
 * @brief Constructor for the iOutputHandler class.
 * @details This constructor initializes the iOutputHandler object.
 * @note This constructor is default, meaning that it does not perform any specific initialization.
 *******************************************************************************/
    iOutputHandler() = default;

/*******************************************************************************
 * @brief Destructor for the iOutputHandler class.
 * @details This destructor cleans up the resources used by the iOutputHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
*******************************************************************************/
    virtual ~iOutputHandler() = default;

/*******************************************************************************
 * @brief Sends the output to the user.
 * @param output The output to be sent.
 * @details This function is a pure virtual function that must be implemented by derived classes.
 * It defines the interface for sending output to the user in the program.
 * @return ioutputHandler reference to the output handler object.
 * @note This function is pure virtual, meaning that any derived class must implement this function.
 *******************************************************************************/
    virtual iOutputHandler &sendOutput(std::string output) = 0;

/*******************************************************************************
 * @brief Sends the output to the user.
 * @param output The output to be sent.
 * @details This function is a pure virtual function that must be implemented by derived classes.
 * It defines the interface for sending output to the user in the program.
 * This function implements the << operator to send output to the user.
 * @return ioutputHandler reference to the output handler object.
 * @note This function is pure virtual, meaning that any derived class must implement this function.
 *******************************************************************************/
    virtual iOutputHandler &operator<<(std::string output) = 0;
};

#endif /* IOUTPUTHANDLER_HEADER */
