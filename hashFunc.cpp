
#include "hashFunc.hpp" // hashFunc class

hashFunc::hashFunc(std::function<size_t(const std::string &)> hashFunction, size_t timesToHash)
                                     : m_hashFunction(hashFunction), m_timesToHash(timesToHash) {}

size_t hashFunc::operator()(const std::string &str) const {return 0;}