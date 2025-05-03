
#include "deleteUrlFromIBF.hpp" // Include the header file where deleteUrlToIBF is defined
#include "immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined

deleteUrlFromIBF:: deleteUrlFromIBF(iOutputHandler &outputStream): m_outputStream(outputStream){
// empty constructor
}

void deleteUrlFromIBF:: execute(immortalBloomFilter *ibf, const std::string &url){
    ibf->deleteUrl(url); // delete the URL to the immortal bloom filter
}