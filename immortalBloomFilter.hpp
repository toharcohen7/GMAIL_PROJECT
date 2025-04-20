/*******************************************************************************
 * @file ImmortalBloomFilter.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef IMMORTAL_BLOOM_FILTER_HEADER
#define IMMORTAL_BLOOM_FILTER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <string>          // string
#include <vector>          // vector

#include "bloomFilter.hpp" // bloomFilter class
#include "hashFunc.hpp"    // hashFunc class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class immortalBloomFilter : public bloomFilter
{
    private:

    const static std::string m_sizeFile;          // Name of the file that stores the size of the bloom filter
    const static std::string m_hashFuncsFile;     // Name of the file that stores the hash functions
    const static std::string m_blackListFile;     // Name of the file that stores the blacklist
    
/*******************************************************************************
    * @brief Constructor for the immortal bloom filter class.
    * @param size Size of the bloom filter.
    * @param hashFunctions Vector of hash functions to be used.
    * @details This constructor initializes the immortal bloom filter with the given size and hash functions.
    * @note The constructor is private to prevent direct instantiation of the class.
 ******************************************************************************/
    immortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions);

    public:

/*******************************************************************************
    * @brief Creates an immortal bloom filter.
    * @param size Size of the bloom filter.
    * @param hashFunctions Vector of hash functions to be used.
    * @return Pointer to the created immortal bloom filter.
    * @details This function creates an immortal bloom filter with the given size and hash functions.
 ******************************************************************************/
static immortalBloomFilter *createImmortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions);

/*******************************************************************************
    * @brief   Revives an immortal bloom filter.
    * @return  Pointer to the revived immortal bloom filter.
    * @details This function revives an immortal bloom filter from the files that 
               store the size, hash functions, and blacklist.
    *          It reads the files and initializes the bloom filter with the stored values.
 ******************************************************************************/
    static immortalBloomFilter *reviveImmortalBloomFilter();

/*******************************************************************************
    * @brief Destructor for the immortal bloom filter class.
    * @details This destructor cleans up the resources used by the immortal bloom filter.
 ******************************************************************************/       
    virtual ~immortalBloomFilter();

/*******************************************************************************
    * @brief Adds a string to the immortal bloom filter.
    * @param str The string to be added.
    * @details - This function adds the given string to the immortal bloom filter and the blacklist.
    *          - It also saves the updated blacklist and bloomFilter bit array to the files.
    *          - It overrides the add method in the bloomFilter class.
 ******************************************************************************/
    virtual void add(const std::string &str);

/*******************************************************************************
    * @brief Checks if the fiels to revive the immortal bloom filter exist.
    * @return True if the files exist, false otherwise.
    * @details This function checks if the files that store the size, 
    *          hash functions, and blacklist exist.
    *        - If the files exist, it means that the immortal bloom filter can be revived.
 ******************************************************************************/
    static bool canBeRevive();
};

#endif /* IMMORTAL_BLOOM_FILTER_HEADER */