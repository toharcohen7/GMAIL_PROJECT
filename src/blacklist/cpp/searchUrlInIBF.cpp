
#include <iostream> // For std::cout and std::endl
#include <string>  // For std::string

#include "../hpp/searchUrlInIBF.hpp" // Include the header file where addUrlToIBF is defined
#include "../hpp/immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined



searchUrlInIBF::searchUrlInIBF(immortalBloomFilter *ibf)
    : m_ibf(ibf) {
    // empty constructor
}

void searchUrlInIBF::execute(iInputHandler &inputStream, iOutputHandler &outputStream,
                                const std::string &url) {

    (void)inputStream; // Suppress unused parameter warning

    std::string returnStr;
    returnStr.append("200 Ok\n\n");
    if (m_ibf->isContains(url)) { // Check if the URL is in the immortal bloom filter
       
        returnStr.append("true "); // URL found in the bloom filter

        // If the URL is in the bloom filter, check if it is a false positive
        m_ibf->isInBlackList(url) ? returnStr.append("true") : returnStr.append("false"); 

    } else {
        returnStr.append("false"); // URL not found in the bloom filter
    }

    outputStream << returnStr;
}