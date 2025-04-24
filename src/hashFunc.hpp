/*******************************************************************************
 * @file hashFunc.hpp
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
    size_t m_timesToHash;

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

/*******************************************************************************
    * @brief Sets the number of times to hash the string.
    * @param timesToHash: The number of times to hash the string.
    * This function sets the number of times to hash the string.
    * @throw std::invalid_argument if timesToHash is 0.
*******************************************************************************/
  void setHashCount(size_t timesToHash);

/*******************************************************************************
    * @brief Gets the number of times to hash the string.
    * @return: The number of times to hash the string.
    * This function returns the number of times to hash the string.
*******************************************************************************/
  size_t getHashCount() const noexcept;

/*******************************************************************************
    * @brief Copy constructor.
    * Creates a new hashFunc object as a copy of an existing one.
    * @param other The hashFunc object to copy from.
 ******************************************************************************/
  hashFunc(const hashFunc& other);

/*******************************************************************************
    * @brief Move constructor.
    * Creates a new hashFunc object by transferring ownership from another hashFunc object.
    * The source object is left in a valid but unspecified state.
    * @param other The hashFunc object to move from.
 ******************************************************************************/
  hashFunc(hashFunc&& other) noexcept;

/*******************************************************************************
    * @brief Destructor.
    * Cleans up resources used by the hashFunc object. Since this class doesn't
    * manage dynamic memory explicitly, the destructor does not need custom logic.
 ******************************************************************************/
  ~hashFunc() = default; 

/*******************************************************************************
    * @brief Copy assignment operator.
    * @return Reference to the assigned object.
    * @note Not in use (= delete) 
 ******************************************************************************/
  hashFunc& operator=(const hashFunc& other) = delete;

/*******************************************************************************
    * @brief Move assignment operator.
    * Replaces the contents of this object by transferring ownership from another hashFunc object.
    * The source object is left in a valid but unspecified state.
    * @param other The hashFunc object to move from.   
    * @return Reference to the assigned object.
    * @note Not in use (= delete)
  ******************************************************************************/
  hashFunc& operator=(hashFunc&& other) noexcept = delete;

};

#endif /* HASH_FUNC_HEADER */