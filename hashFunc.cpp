
#include "hashFunc.hpp" // hashFunc class
#include <stdexcept>

// Constructor
hashFunc::hashFunc(std::function<size_t(const std::string &)> hashFunction, size_t timesToHash)
                                     : m_hashFunction(hashFunction), m_timesToHash(timesToHash) 
{
    if(timesToHash == 0)
    {
        throw std::invalid_argument("timesToHash must be greater than 0");
    }
}

size_t hashFunc::operator()(const std::string &str) const 
{
    size_t hashResult;
    hashResult = m_hashFunction(str);
    
    for (size_t i = 0; i < m_timesToHash - 1; i++)  // (m_timesToHash - 1) is valid made sure of that in constructor 
    {
        hashResult = m_hashFunction(std::to_string(hashResult)); // Reapply the hash function on the stringified result of the previous hash
    }
    return hashResult;
}

// Copy Constructor
hashFunc::hashFunc(const hashFunc& other)
    : m_hashFunction(other.m_hashFunction), m_timesToHash(other.m_timesToHash) {}

