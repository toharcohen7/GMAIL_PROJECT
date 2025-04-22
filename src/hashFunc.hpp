/*******************************************************************************
 * @file bloomFilter.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef HASH_FUNC_HEADER
#define HASH_FUNC_HEADER


/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <functional> // std::function
#include <string>     // string


/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/


class hashFunc
{
private:
    const std::function<size_t (const std::string &)> m_hashFunction;
    const size_t m_timesToHash;

public:
/*******************************************************************************
 * Constructor
 * @param hashFunction: A function that takes a string and returns an unsigned int.
 * @param timesToHash: The number of times to hash the string.
 * This function will be used as the hash function for the hashFunc class.
 ******************************************************************************/
    hashFunc(std::function<size_t(const std::string &)> hashFunction, size_t timesToHash = 1);

/*******************************************************************************
 * operator()
 * @param str: The string to be hashed.
 * @return: The hash value of the string.
 * This function calls the hash function passed to the constructor.
   It takes a string as input and returns an unsigned int as the hash value.
 ******************************************************************************/
    size_t operator()(const std::string &str) const;
}; 

#endif /* HASH_FUNC_HEADER */