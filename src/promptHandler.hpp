/***************************
 * @file promptHandler.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
***************************/

#ifndef PROMPTHANDLER_HEADER
#define PROMPTHANDLER_HEADER

/***************************
 *                                INCLUDES                                     *
 * **************************/

#include "iInputHandler.hpp" // iInputHandler class
#include "iOutputHandler.hpp" // iOutputHandler class
        
class promptHandler : public iInputHandler, public iOutputHandler
{

public:
/***************************
 * @brief Constructor for the promptHandler class.
 * @details This constructor initializes the promptHandler object.
 * @note This constructor is default, meaning that it does not perform any specific initialization.
 ***************************/
    promptHandler() = default;
/***************************
 * @brief Destructor for the promptHandler class.
 * @details This destructor cleans up the resources used by the promptHandler object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 ***************************/
    ~promptHandler() = default;

/***************************
 * @brief Gets the user input from the console.
 * @details This function is implemented to get user input from the console.
 * @return The user input as a string.
 * @note This function overrides the pure virtual function from the iInputHandler class.
 ***************************/
    virtual std::string getInput() override;

/***************************
 * @brief Sends the output to the console.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the console.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 ***************************/
    virtual iOutputHandler &sendOutput(std::string output) override;

/***************************
 * @brief Sends the output to the console.
 * @param output The output to be sent.
 * @details This function is implemented to send output to the console.
 * This function implements the << operator to send output to the console.
 * @return iOutputHandler reference to the output handler object.
 * @note This function overrides the pure virtual function from the iOutputHandler class.
 ***************************/
    virtual iOutputHandler &operator<<(std::string output) override;
};

#endif /* PROMPTHANDLER_HEADER */