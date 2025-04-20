
#include "addUrlToIBF.hpp" // Include the header file where addUrlToIBF is defined
#include "immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined


addUrlToIBF::addUrlToIBF() {
    // empty constructor
}

void addUrlToIBF::execute(immortalBloomFilter *ibf, const std::string &url) {
    ibf->add(url); // Add the URL to the immortal bloom filter
}