
#include "deleteUrlFromIBF.hpp" // Include the header file where deleteUrlToIBF is defined
#include "immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined

deleteUrlFromIBF:: deleteUrlFromIBF(iOutputHandler &outputStream): m_outputStream(outputStream){
// empty constructor
}

void deleteUrlFromIBF:: execute(immortalBloomFilter *ibf, const std::string &url){
    if(ibf->remove(url)){ // delete the URL from the immortal bloom filter
        m_outputStream << "204 No Content\n";
    }
     m_outputStream << "404 Not Found\n";
}