/*******************************************************************************
 * @file iRunnable.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef IRUNNABLE_HEADER
#define IRUNNABLE_HEADER

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class iRunnable
{
    public:

/*******************************************************************************
 * @brief Constructor for the iRunnable class.
 * @details This constructor initializes the iRunnable object.
 * @note This constructor is default, meaning that it does not perform any specific initialization.
 *******************************************************************************/
    iRunnable() = default;

/*******************************************************************************
 * @brief Destructor for the iRunnable class.
 * @details This destructor cleans up the resources used by the iRunnable object.
 * @note This destructor is virtual, allowing for proper cleanup of derived classes.
*******************************************************************************/
    virtual ~iRunnable() = default;

/*******************************************************************************
 * @brief Pure virtual function to be implemented by derived classes.
 * @details This function is a pure virtual function that must be implemented by derived classes.
 * It defines the interface for running program in the derived classes.
 * @param inputStream Input stream for reading user input.
 * @param outputStream Output stream for sending messages.
 * @note This function is pure virtual, meaning that any derived class must implement this function.
********************************************************************************/
    virtual void run(iInputHandler &inputStream, iOutputHandler &outputStream) = 0; // Pure virtual function to be implemented by derived classes

};

#endif /* IRUNNABLE_HEADER */
