
#include <iostream> // For std::cout and std::endl
#include <string>  // For std::string

#include "searchUrlInIBF.hpp" // Include the header file where addUrlToIBF is defined
#include "immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined



searchUrlInIBF::searchUrlInIBF(iOutputHandler &outputStream)
    : m_outputStream(outputStream) {
    // empty constructor
}

void searchUrlInIBF::execute(immortalBloomFilter *ibf, const std::string &url) {
    std::string returnStr;
    returnStr.append("200 Ok\n\n");
    if (ibf->isContains(url)) { // Check if the URL is in the immortal bloom filter
       
        returnStr.append("true "); // URL found in the bloom filter

        // If the URL is in the bloom filter, check if it is a false positive
        ibf->isInBlackList(url) ? returnStr.append("true") : returnStr.append("false"); 

    } else {
        returnStr.append("false"); // URL not found in the bloom filter
    }

    returnStr.append("\n"); // Print a new line
    m_outputStream << returnStr;
}