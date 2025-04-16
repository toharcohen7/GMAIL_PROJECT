#include "bloomFilter.hpp"
#include <stdexcept>

bloomFilter::bloomFilter(int size, std::vector<hashFunc> &hashFunctions) {}

bloomFilter::~bloomFilter() {}

void bloomFilter::add(const std::string &input) {}

bool bloomFilter::isContains(const std::string &input) const {return false;}

bool bloomFilter::isInBlackList(const std::string &input) const {return false;}
