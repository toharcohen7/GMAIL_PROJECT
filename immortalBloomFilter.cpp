

#include "immortalBloomFilter.hpp"

const std::string immortalBloomFilter::m_sizeFile = "";          // Name of the file that stores the size of the bloom filter;         
const std::string immortalBloomFilter::m_hashFuncsFile = "";     
const std::string immortalBloomFilter::m_blackListFile = "";      

immortalBloomFilter::immortalBloomFilter(int size, std::vector<hashFunc> &hashFunctions)
 : bloomFilter(size, hashFunctions) {}

immortalBloomFilter *immortalBloomFilter::createImmortalBloomFilter(int size, std::vector<hashFunc> &hashFunctions) {return nullptr;}
 
immortalBloomFilter *immortalBloomFilter::reviveImmortalBloomFilter(){return nullptr;}

immortalBloomFilter::~immortalBloomFilter() {}

void immortalBloomFilter::add(const std::string &str) {}

bool immortalBloomFilter::canBeRevive() {return false;}
