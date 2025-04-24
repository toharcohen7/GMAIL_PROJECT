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

#include "immortalBloomFilter.hpp" // immortalBloomFilter class 
#include <iostream>               // iostream
#include <string>                // string
#include "hashFunc.hpp"         // hashFunc class

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
 * @param inputStream Input stream to read user input from. Defaults to std::cin.
 * @param hashFunctions Vector of hash functions to be used in the bloom filter.
 * @return Pointer to a newly created immortalBloomFilter object.
 * @details This function prompts the user (or reads from a stream) to input the 
 * bloom filter size and the number of hash functions to use. It validates the input, 
 * initializes the hash functions, and creates the bloom filter accordingly.
 * @note - If there are more hash functions than hash counts, the remaining hash functions
 *         are stay the same.
 *       - if there are more hash counts from the input than hash functions,
 *         new hash functions (std::hash) are created for the remaining counts.
 *       - The user must enter size bigger than 0 and at least one hash count bigger than 0.   
 ******************************************************************************/
    static immortalBloomFilter *createNewIBF(std::vector<hashFunc> &hashFunctions, 
                                             std::istream &inputStream = std::cin);

};

#endif // INIT_PROGRAM_HPP