/*******************************************************************************
 * @file iCommand.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef ICOMMAND_HEADER
#define ICOMMAND_HEADER


/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <string> // For std::string

#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "iOutputHandler.hpp"     // iOutputHandler class
#include "iInputHandler.hpp"     // iInputHandler class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class iCommand
{
    public:
/*******************************************************************************
    * @brief Executes the command.
    * @param inputStream The input handler for reading input.
    * @param outputStream The output handler for writing output.
    * @param url The URL to be processed.
    * @details This function is a pure virtual function that must be implemented by derived classes.
    * It defines the interface for executing commands in the program.
    * @note This function is pure virtual, meaning that any derived class must implement this function.
*******************************************************************************/
        virtual void execute(iInputHandler &inputStream, iOutputHandler &outputStream,
                                const std::string &url) = 0;

/*******************************************************************************
    * @brief Destructor for the iCommand class.
    * @details This destructor is virtual to ensure proper cleanup of derived classes.
    * It allows for polymorphic behavior when deleting objects of derived classes through a base class pointer.
    * @note This destructor is virtual, allowing for proper cleanup of derived classes.
*******************************************************************************/
        virtual ~iCommand() = default; // Virtual destructor for proper cleanup of derived classes
};

#endif /* ICOMMAND_HEADER */