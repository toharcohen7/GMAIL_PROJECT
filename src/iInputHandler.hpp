/*******************************************************************************
 * @file iInputHandler.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef IINPUTHANDLER_HEADER
#define IINPUTHANDLER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/
#include <string>

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class iInputHandler
{
    public:

/*******************************************************************************
  * @brief Constructor for the iInputHandler class.
  * @details This constructor initializes the iInputHandler object.
  * @note This constructor is default, meaning that it does not perform any specific initialization.
 *******************************************************************************/
    iInputHandler() = default;

/*******************************************************************************
  * @brief Destructor for the iInputHandler class.
  * @details This destructor cleans up the resources used by the iInputHandler object.
  * @note This destructor is virtual, allowing for proper cleanup of derived classes.
 *******************************************************************************/
    virtual ~iInputHandler() = default;

/*******************************************************************************
 * @brief Gets the user input.
 * @details This function is a pure virtual function that must be implemented by derived classes.
 * It defines the interface for getting user input in the program.
 * @return The user input as a string.
 * @note This function is pure virtual, meaning that any derived class must implement this function.
 *******************************************************************************/
    virtual std::string getInput() = 0;
};


#endif /* IINPUTHANDLER_HEADER */
