/*******************************************************************************
 * @file bloomFilter.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/


#ifndef BLOOM_FILTER_HEADER
#define BLOOM_FILTER_HEADER


/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <vector>       // vector
#include <string>       // string

#include "hashFunc.hpp" // hashFunc class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/
class bloomFilter
{
private:
    // vector of hash functions
    std::vector<hashFunc> *m_hashFunctions;
    // bit vector to store the bloom filter 
    std::vector<bool> *m_bitVector; 
    // blacklist to store the actual strings that are in the bloom filter
    std::vector<std::string> *m_blackList; 

public:

/*******************************************************************************
    * @brief Constructor for the bloom filter class.
    * @param size Size of the bloom filter.
    * @param hashFunctions Vector of hash functions to be used.
    * @details This constructor initializes the bloom filter with the given size and hash functions.
 ******************************************************************************/
    bloomFilter(size_t size, std::vector<hashFunc> &hashFunctions);

/*******************************************************************************
    * @brief Destructor for the bloom filter class.
    * @details This destructor cleans up the resources used by the bloom filter.
 ******************************************************************************/
    virtual ~bloomFilter();

/*******************************************************************************
    * @brief Adds a string to the bloom filter.
    * @param input The string to be added.
    * @details This function adds the given string to the bloom filter and the blacklist.
    * Can be overriden in derived classes.
 ******************************************************************************/
    virtual void add(const std::string &input); 

/*******************************************************************************
    * @brief Checks if a string is in the bloom filter.
    * @param input The string to be checked.
    * @return True if the string is in the bloom filter, false otherwise. can be a false positive.
    * @details This function checks if the given string is in the bloom filter.
    * It uses the hash functions to check the bits in the bit vector.
 ******************************************************************************/    
    bool isContains(const std::string &input) const; 

/*******************************************************************************
    * @brief Checks if a string is in the blacklist.
    * @param input The string to be checked.
    * @return True if the string is in the blacklist, false otherwise, without false positive.
    * @details This function checks if the given string is in the blacklist.
 ******************************************************************************/
    bool isInBlackList(const std::string &input) const; 
};

#endif /* BLOOM_FILTER_HEADER */