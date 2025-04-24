
#include <stdexcept>      // std::invalid_argument

#include "hashFunc.hpp" // hashFunc class


// Constructor
hashFunc::hashFunc(std::function<size_t(const std::string &)> hashFunction, size_t timesToHash)
                                     : m_hashFunction(hashFunction), m_timesToHash(timesToHash) {

    if (0 == timesToHash) { // If timesToHash is 0, throw an exception
        throw std::invalid_argument("Hash count must be greater than 0");
    }
}

// operator() function
size_t hashFunc::operator()(const std::string &str) const 
{
    if (m_timesToHash == 0) { // If timesToHash is 0, throw an exception
        throw std::invalid_argument("Hash count must be greater than 0 when calling operator()");
    }
    
    size_t hashResult = m_hashFunction(str);;

    for (size_t i = 0; i < m_timesToHash - 1; i++) { // (m_timesToHash - 1) is valid made sure of that in constructor 
    
        // Reapply the hash function on the stringified result of the previous hash
        hashResult = m_hashFunction(std::to_string(hashResult)); 
    }

    return hashResult;
}

// Set the number of times to hash the string
void hashFunc::setHashCount(size_t timesToHash) {

    if (0 == timesToHash) { // If timesToHash is 0, throw an exception
        throw std::invalid_argument("Hash count must be greater than 0");
    }

    m_timesToHash = timesToHash;
}

// Get the number of times to hash the string
size_t hashFunc::getHashCount() const noexcept {

    return m_timesToHash;
}

// Copy Constructor
hashFunc::hashFunc(const hashFunc& other)
    : m_hashFunction(other.m_hashFunction), m_timesToHash(other.m_timesToHash) { 
        // empty body
}

hashFunc::hashFunc(hashFunc&& other) noexcept
    : m_hashFunction(std::move(other.m_hashFunction)), m_timesToHash(other.m_timesToHash) {
    // empty body
}