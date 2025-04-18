

#include "immortalBloomFilter.hpp"

const std::string immortalBloomFilter::m_sizeFile = "";          // Name of the file that stores the size of the bloom filter;         
const std::string immortalBloomFilter::m_hashFuncsFile = "";     
const std::string immortalBloomFilter::m_blackListFile = "";      

immortalBloomFilter::immortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions)
 : bloomFilter(size, hashFunctions) {}

immortalBloomFilter *immortalBloomFilter::createImmortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions) 
{return new immortalBloomFilter(size, hashFunctions);}
 
immortalBloomFilter *immortalBloomFilter::reviveImmortalBloomFilter(){return nullptr;}

immortalBloomFilter::~immortalBloomFilter() {}

void immortalBloomFilter::add(const std::string &str) {
    bloomFilter::add(str); // Call the base class add function
}

bool immortalBloomFilter::canBeRevive() {return false;}
