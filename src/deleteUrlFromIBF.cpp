
#include "deleteUrlFromIBF.hpp" // Include the header file where deleteUrlToIBF is defined
#include "immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined

deleteUrlFromIBF::deleteUrlFromIBF(immortalBloomFilter *ibf): m_ibf(ibf){
// empty constructor
}

void deleteUrlFromIBF::execute(iInputHandler &inputStream, iOutputHandler &outputStream,
    const std::string &url){

    (void)inputStream; // Suppress unused parameter warning

    if(m_ibf->remove(url)){ // delete the URL from the immortal bloom filter
        outputStream << "204 No Content";
    }
    else
    {
        outputStream << "404 Not Found";
    }
}