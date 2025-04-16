#include "bloomFilter.hpp"
#include <stdexcept>

bloomFilter::bloomFilter(int size, int hashCount1, int hashCount2) {

    // Validate the parameters
    if (size <= 0 || hashCount1 <= 0 || hashCount2 < 0) {
        throw std::invalid_argument("Size and hash counts must be positive integers.");
    }

    // Initialize the member variables only after validation
    this->size = size; // Set the size of the bloom filter
    this->hashCount1 = hashCount1; // Set the number of hash1
    this->hashCount2 = hashCount2; // Set the number of hash2 (default is 0)

    bitVector = new std::vector<bool>(size, false); // Initialize the bit vector with size and set all bits to false
    blackList = new std::vector<std::string>(); // Initialize the blacklist
}

bloomFilter::~bloomFilter() {
    
    delete bitVector; // Free the memory allocated for the bit vector
    delete blackList; // Free the memory allocated for the blacklist
}

void bloomFilter::add(const std::string &input) {}

bool bloomFilter::isContains(const std::string &input) {return false;}

bool bloomFilter::isInBlackList(const std::string &input) {return false;}

bool bloomFilter::isValidForCreation(const std::string &input) {return false;}

bool bloomFilter::isValidForOperation(const std::string &input) {return false;}
