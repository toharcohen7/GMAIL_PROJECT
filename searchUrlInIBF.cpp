
#include <iostream> // For std::cout and std::endl
#include <string>  // For std::string

#include "searchUrlInIBF.hpp" // Include the header file where addUrlToIBF is defined
#include "immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined


searchUrlInIBF::searchUrlInIBF(std::ostream &outputStream)
    : m_outputStream(outputStream) {
    // empty constructor
}

void searchUrlInIBF::execute(immortalBloomFilter *ibf, const std::string &url) {
    if (ibf->isContains(url)) { // Check if the URL is in the immortal bloom filter
       
        m_outputStream << "true ";

        // If the URL is in the bloom filter, check if it is a false positive
        ibf->isInBlackList(url) ? m_outputStream << "true" : m_outputStream << "false"; 
        m_outputStream << std::endl; // Print a newline character

    } else {
        m_outputStream << "false" << std::endl; // URL not found in the bloom filter
    }
}