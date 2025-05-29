
#include <fstream>      // ifstream, ofstream
#include <sstream>     // stringstream
#include <filesystem> // filesystem

#include "../hpp/immortalBloomFilter.hpp" // immortalBloomFilter class
     

immortalBloomFilter::immortalBloomFilter(size_t size, std::vector<hashFunc> &hashFunctions,
    const std::string &blackListFile)
 : bloomFilter(size, hashFunctions), m_blackListFile(blackListFile) {

    if (std::filesystem::exists(m_blackListFile)) { // Check if the file exists
        
        std::ifstream blackFile(m_blackListFile);
        
        if (!blackFile.is_open()) {
            throw std::runtime_error("Failed to open blacklist file for reading");
        }

        std::string line;
        while (std::getline(blackFile, line)) {
            this->bloomFilter::add(line);    
        }

        blackFile.close();

    } else { // If the file does not exist, create it

        std::filesystem::create_directories(std::filesystem::path(m_blackListFile).parent_path());
        std::ofstream blackFile(m_blackListFile);
        
        if (!blackFile.is_open()) {
            throw std::runtime_error("Failed to create blacklist file");
        }

        blackFile.close();
    }
 }

immortalBloomFilter::~immortalBloomFilter() { /* empty destructor */ } 

void immortalBloomFilter::add(const std::string &str) {

    std:: ofstream blackListFile (m_blackListFile, std::ios::app);

    if(!blackListFile.is_open()){
        throw std::runtime_error("Failed to open blacklist file for appending");
    }
    blackListFile << str <<'\n';
    blackListFile.close();

    bloomFilter::add(str);
}

bool immortalBloomFilter::remove(const std::string &str){
    if(bloomFilter::isInBlackList(str)){
    // open the blacklist file
        std::ifstream blackListFileIn(m_blackListFile);
        if (!blackListFileIn.is_open()) {
            throw std::runtime_error("Failed to open blacklist file for reading");
        }
    // insert all blackilst strings except the one we want to delete to a vector  
        std::vector<std::string> updatedLines;
        std::string line;
        while (std::getline(blackListFileIn, line)) {
            if (line != str) {
                updatedLines.push_back(line);
            }
        }
        blackListFileIn.close();
    // open the blacklist file and clean it from content
        std::ofstream blackListFileOut(m_blackListFile, std::ios::trunc);
        if (!blackListFileOut.is_open()) {
            throw std::runtime_error("Failed to open blacklist file for overwriting");
        }
    // insert all strings (without the one we want to delete) to the blacklist file
        for (const auto& entry : updatedLines) {
            blackListFileOut << entry << '\n';
        }
        blackListFileOut.close();

        bloomFilter::remove(str);
        return true;
    }
    return false;
}
