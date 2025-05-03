#include "bloomFilter.hpp"
#include <stdexcept>
#include <algorithm>

bloomFilter::bloomFilter(size_t size, std::vector<hashFunc> &hashFunctions) {

    if (0 == size) {
        throw std::invalid_argument("Size must be greater than 0.");
    }
    if (hashFunctions.empty()) {
        throw std::invalid_argument("Hash functions vector cannot be empty.");
    }

    m_hashFunctions = new std::vector<hashFunc>(hashFunctions); // Deep copy of the hash functions
    m_bitVector = new std::vector<bool>(size, false);
    m_blackList = new std::vector<std::string>();
}

bloomFilter::~bloomFilter() {
    delete m_hashFunctions;
    m_hashFunctions = nullptr;
    delete m_bitVector;
    m_bitVector = nullptr;
    delete m_blackList;
    m_blackList = nullptr;
}

void bloomFilter::add(const std::string &input) {

    m_blackList->push_back(input); // Add to the blacklist

    for (const auto &hashFunction : *m_hashFunctions) {
        size_t hashValue = hashFunction(input) % m_bitVector->size(); // Hash the input and get the index
        (*m_bitVector)[hashValue] = true; // Set the bit at the index to true
    }
}

bool bloomFilter::isContains(const std::string &input) const {
    for (const auto &hashFunction : *m_hashFunctions) {
        size_t hashValue = hashFunction(input) % m_bitVector->size(); // Hash the input and get the index
        if (!(*m_bitVector)[hashValue]) { // If any bit is false, return false
            return false;
        }
    }
    return true; // All bits are true, so it might be in the bloom filter
}

bool bloomFilter::isInBlackList(const std::string &input) const {
    for (const auto &str : *m_blackList) {
        if (str == input) { // Check if the input is in the blacklist
            return true;
        }
    }
    return false; // Not found in the blacklist
}
bool bloomFilter::remove(const std::string &input) {
 // checking if the string exists in the vector if so erasing all of the instances    
    if(isInBlackList(input)){
    m_blackList->erase(std::remove(m_blackList->begin(), m_blackList->end(), input),m_blackList->end());
    return true;
    }
    return false; 
}
