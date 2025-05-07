/*******************************************************************************
 * @file initProgram.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef INIT_PROGRAM_HEADER
#define INIT_PROGRAM_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <iostream>               // iostream
#include <string>                // string

#include "immortalBloomFilter.hpp" // immortalBloomFilter class 
#include "hashFunc.hpp"           // hashFunc class
#include "runProgram.hpp"      // runProgram class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class initProgram
{
    private:
/*******************************************************************************
 * @brief Private constructor to prevent instantiation.
*******************************************************************************/
    initProgram() = delete; 

    public:

/*******************************************************************************
 * @brief Creates and initializes a new Immortal Bloom Filter.
 * @param ibfSize Size of the bloom filter.
 * @param hashCounts Vector of ints that indicate the number of times to hash for each function.
 * @param hashFunctions Vector of hash functions to be used.
 * @return Pointer to a newly created immortalBloomFilter object.
 * @details This function creates a new immortal bloom filter with the specified size and hash functions.
 * @note - If there are more hash functions than hash counts, the remaining hash functions
 *         are stay the same.
 *       - if there are more hash counts from the input than hash functions,
 *         new hash functions (std::hash) are created for the remaining counts.
 *       - The user must enter size bigger than 0 and at least one hash count bigger than 0.   
 ******************************************************************************/
    static immortalBloomFilter *createNewIBF(size_t ibfSize, std::vector<int> hashCounts, 
                                                std::vector<hashFunc> &hashFunctions);

/*******************************************************************************
 * @brief Creates a new runProgram object.
 * @param ibf Pointer to the immortal bloom filter object.
 * @return Pointer to a new runProgram object.
 * @details This function creates a new runProgram object with the specified immortal bloom filter.
 * @note The runProgram object is responsible for running the program and handling user input.
 ******************************************************************************/
    static runProgram *createRunProgram(immortalBloomFilter *ibf);

};

#endif // INIT_PROGRAM_HPP