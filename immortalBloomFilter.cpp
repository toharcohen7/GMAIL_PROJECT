
#include "immortalBloomFilter.hpp"
#include <fstream>
#include <sstream>

// const std::string immortalBloomFilter::m_sizeFile = "./data/sizeFile.txt";          // Name of the file that stores the size of the bloom filter;         
// const std::string immortalBloomFilter::m_hashFuncsFile = "./data/hashFuncsFile.txt";     
const std::string immortalBloomFilter::m_blackListFile = "./data/blackListFile.txt";      

/*
*Constructor: Initializes the immortal bloom filter using the base class constructor
*/
immortalBloomFilter::immortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions)
 : bloomFilter(size, hashFunctions) {}

/*
* Creates a new immortal bloom filter instance(from scratch).
*/
 immortalBloomFilter *immortalBloomFilter::createImmortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions) {
/*
// initealize size file
        std::ofstream sizeFile(m_sizeFile);
        if (!sizeFile.is_open()) {
            throw std::runtime_error("Failed to open size file for writing");
        }
        sizeFile << size << '\n';
        sizeFile.close();

    // initealize hashfancs file
    
        std::ofstream hashFile(m_hashFuncsFile);
        if (!hashFile.is_open()) {
            throw std::runtime_error("Failed to open hash functions file for writing");
        }

        for (const auto &func : hashFunctions) {
            hashFile << func.getName() << ' ' << func.getTimesToHash() << '\n';   // ganuvi consult about .getname .getTimesToHash
        }
        hashFile.close();

*/
    return new immortalBloomFilter(size, hashFunctions);
}

/*
* Revives an immortal bloom filter by re-adding all entries from the blacklist file.
* Adds the entries into the filter's memory structures without rewriting the file.
*/
immortalBloomFilter *immortalBloomFilter::reviveImmortalBloomFilter(size_t size, std::vector<hashFunc>& hashFunctions){
    /*
    size_t size;
    std::ifstream file(m_sizeFile);
    std::string line;
    std::getline(file, line);
    std::stringstream(line) >> size;
    */
   immortalBloomFilter* filter = new immortalBloomFilter(size, hashFunctions);
   std::ifstream blackFile(m_blackListFile);
   if (!blackFile.is_open()) {
       throw std::runtime_error("Failed to open blacklist file for reading");
   }

   std::string line;
   while (std::getline(blackFile, line)) {
       filter->bloomFilter::add(line);
   }


   blackFile.close();
   return filter;
}
/*
* No additional cleanup needed; bloomFilter handles resource management.
*/
immortalBloomFilter::~immortalBloomFilter() {} 


/*
* Adds a string to the bloom filter and persists it by appending to the blacklist file
*/
void immortalBloomFilter::add(const std::string &str) {
    bloomFilter::add(str);
    std:: ofstream blackListFile (m_blackListFile, std::ios::app);
    if(!blackListFile.is_open()){
        throw std::runtime_error("Failed to open blacklist file for appending");
    }
    blackListFile << str <<'\n';
    blackListFile.close();
}
/*
* Checks if the blacklist file exists and can be used for revival
*/
bool immortalBloomFilter::canBeRevive() {
    // std::ifstream sizeFile(m_sizeFile);
    // std::ifstream hashFuncsFile(m_hashFuncsFile);
    std::ifstream blackListFile(m_blackListFile);

    return (/*sizeFile.good() && hashFuncsFile.good() &&*/ blackListFile.good());
}
