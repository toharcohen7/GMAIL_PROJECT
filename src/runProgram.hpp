/*******************************************************************************
 * @file runProgram.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef RUN_PROGRAM_HEADER
#define RUN_PROGRAM_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <iostream>
#include <map> // For std::map

#include "immortalBloomFilter.hpp"
#include "iCommand.hpp" // iCommand class
#include "iInputHandler.hpp" // iInputHandler class
#include "iOutputHandler.hpp"

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class runProgram
{
    private:

    std::map<std::string, iCommand*> &m_commands; //// Map of command numbers to command objects
    immortalBloomFilter *m_ibf; // Pointer to the immortal bloom filter objec
    iOutputHandler &m_outputStream; // Output stream for printing messages
    iInputHandler &m_inputStream; // Input stream for reading user input

    public:

/*******************************************************************************
    * @brief Constructor for the runProgram class.
    * @param commands Map of command numbers to command objects.
    * @param inputStream Input stream for reading user input.
    * @param outputStream Output stream for printing user output.
    * @param ibf The immortal bloom filter instance to operate on.
    * @details This constructor initializes the runProgram object and creates an immortal bloom filter.
*******************************************************************************/
    runProgram(std::map<std::string, iCommand*> &commands, immortalBloomFilter *ibf,
                iInputHandler &inputStream,iOutputHandler &outputStream);

/*******************************************************************************
    * @brief Destructor for the runProgram class.
    * @details This destructor cleans up the resources used by the runProgram object.
*******************************************************************************/
    ~runProgram();

/*******************************************************************************
    * @brief Runs the program.
    * @details This function runs the program and handles user input.
*******************************************************************************/
    void run(); 
};

#endif /* RUN_PROGRAM_HEADER */