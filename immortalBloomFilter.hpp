
#include <string>     // string
#include <vector>       // vector

#include "bloomFilter.hpp" // bloomFilter class
#include "hashFunc.hpp" // hashFunc class


class immortalBloomFilter : public bloomFilter
{
    private:

    static std::string m_sizeFile;
    static std::string m_hashFuncsFile;
    static std::string m_blackListFile;
    
    public:

    immortalBloomFilter(int size, std::vector<hashFunc> &hashFunctions);
    immortalBloomFilter();
    virtual void add(const std::string &str);
    static bool canBeRevive();

};