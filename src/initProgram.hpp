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
 * @return Pointer to a newly created immortalBloomFilter object.
 * @details This function prompts the user (or reads from a stream) to input the 
 * bloom filter size and the number of hash functions to use. It validates the input, 
 * initializes the hash functions, and creates the bloom filter accordingly.
 ******************************************************************************/
    static immortalBloomFilter *createNewIBF(std::istream &inputStream = std::cin);

};

#endif // INIT_PROGRAM_HPP