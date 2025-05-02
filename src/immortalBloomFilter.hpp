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

#include <string>            // string
#include <vector>           // vector
#include "bloomFilter.hpp" // bloomFilter class
#include "hashFunc.hpp"   // hashFunc class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class immortalBloomFilter : public bloomFilter
{
    private:

    const std::string m_blackListFile;     // Name of the file that stores the blacklist
    
    public:

/*******************************************************************************
    * @brief Constructor for the immortal bloom filter class.
    * @param size Size of the bloom filter.
    * @param hashFunctions Vector of hash functions to be used.
    * @details This constructor initializes the immortal bloom filter with the given size and hash functions.
 ******************************************************************************/
    immortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions,
             const std::string &blackListFile = "../data/blackListFile.txt");

/*******************************************************************************
    * @brief Destructor for the immortal bloom filter class.
    * @details This destructor cleans up the resources used by the immortal bloom filter.
 ******************************************************************************/       
    virtual ~immortalBloomFilter();

/*******************************************************************************
    * @brief Copy constructor.
    * @param other The object to copy from.
    * @details Creates a new object as a copy of an existing immortal bloom filter, 
    * including its internal state and configuration.
    * @note Not in use (= delete)
 ******************************************************************************/
    immortalBloomFilter(const immortalBloomFilter& other) = delete;

/*******************************************************************************
    * @brief Copy assignment operator.
    * @param other The object to copy from.
    * @return Reference to the updated object.
    * @details Replaces the current object’s contents with a copy of another 
    * immortal bloom filter, managing any previously held resources.
    * @note Not in use (= delete)
 ******************************************************************************/
    immortalBloomFilter& operator=(const immortalBloomFilter& other) = delete;
    
/*******************************************************************************
    * @brief Move constructor.
    * @param other The object to move from.
    * @details Transfers ownership of resources from another immortal bloom filter
    * without performing a deep copy.
    * @note Not in use (= delete)
 ******************************************************************************/
    immortalBloomFilter(immortalBloomFilter&& other) noexcept = delete;

/*******************************************************************************
    * @brief Move assignment operator.
    * @param other The object to move from.
    * @return Reference to the updated object.
    * @details Moves the internal resources from another object into this one,
    * cleaning up the current state beforehand.
    * @note Not in use (= delete)
 ******************************************************************************/
    immortalBloomFilter& operator=(immortalBloomFilter&& other) noexcept = delete;    

/*******************************************************************************
    * @brief Adds a string to the immortal bloom filter.
    * @param str The string to be added.
    * @details - This function adds the given string to the immortal bloom filter and the blacklist.
    *          - It also saves the updated blacklist and bloomFilter bit array to the files.
    *          - It overrides the add method in the bloomFilter class.
 ******************************************************************************/
    virtual void add(const std::string &str) override;
};

#endif /* IMMORTAL_BLOOM_FILTER_HEADER */