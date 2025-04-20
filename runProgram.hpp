/*******************************************************************************
 * @file runProgram.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <iostream>

#include "immortalBloomFilter.hpp"

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class runProgram
{
    private:

    immortalBloomFilter *m_ibf; // Pointer to the immortal bloom filter object
    std::ostream &m_outputStream; // Output stream for printing messages
    std::istream &m_inputStream; // Input stream for reading user input

    public:
/********************************************************************************
    * @brief Constructor for the runProgram class.
    * @details This constructor initializes the runProgram object and creates an immortal bloom filter.
******************************************************************************/
    runProgram(std::ostream &outputStream = std::cout, std::istream &inputStream = std::cin);

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