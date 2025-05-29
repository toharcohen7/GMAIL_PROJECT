
#include "../hpp/addUrlToIBF.hpp" // Include the header file where addUrlToIBF is defined
#include "../hpp/immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined


addUrlToIBF::addUrlToIBF(immortalBloomFilter *ibf): m_ibf(ibf) {
    // empty constructor
}

void addUrlToIBF::execute(iInputHandler &inputStream, iOutputHandler &outputStream,
                            const std::string &url) {

    (void)inputStream; // Suppress unused parameter warning
    m_ibf->add(url); // Add the URL to the immortal bloom filter
    outputStream << "201 Created";
}