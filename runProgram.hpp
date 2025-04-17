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

#include "immortalBloomFilter.hpp"

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class runProgram
{
    private:

    immortalBloomFilter *ibf; // Pointer to the immortal bloom filter object

    public:
/********************************************************************************
* @brief Constructor for the runProgram class.
* @details This constructor initializes the runProgram object and creates an immortal bloom filter.
******************************************************************************/
    runProgram();

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