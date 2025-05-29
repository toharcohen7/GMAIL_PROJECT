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

#include <map>    // For std::map
#include <mutex> // For std::mutex

#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "iCommand.hpp"           // iCommand class
#include "iInputHandler.hpp"     // iInputHandler class
#include "iOutputHandler.hpp"   // iOutputHandler class
#include "iRunnable.hpp"       // iRunnable class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class runProgram : public iRunnable
{
    private:

    std::map<std::string, iCommand*> m_commands; // Map of command numbers to command objects
    immortalBloomFilter *m_ibf; // Pointer to the immortal bloom filter objec
    std::mutex m_mutex;

    public:

/*******************************************************************************
    * @brief Constructor for the runProgram class.
    * @param ibf The immortal bloom filter instance to operate on.
    * @details This constructor initializes the runProgram object and creates an immortal bloom filter.
*******************************************************************************/
    runProgram(immortalBloomFilter *ibf);

/*******************************************************************************
    * @brief Destructor for the runProgram class.
    * @details This destructor cleans up the resources used by the runProgram object.
*******************************************************************************/
    ~runProgram();

/*******************************************************************************
    * @brief Runs the program.
    * @details This function runs the program and handles user input.
    * @param inputStream Input stream for reading user input.
    * @param outputStream Output stream for sending messages.
*******************************************************************************/
    virtual void run(iInputHandler &inputStream, iOutputHandler &outputStream) override; 
};

#endif /* RUN_PROGRAM_HEADER */