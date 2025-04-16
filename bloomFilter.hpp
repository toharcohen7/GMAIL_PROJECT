#ifndef BLOOM_FILTER_HEADER
#define BLOOM_FILTER_HEADER

#include <vector>
#include <string>

class bloomFilter
{
private:
    /* data */
    int size; // size of the bloom filter
    int hashCount1; // number of hash functions
    int hashCount2; // number of hash functions
    std::vector<bool> *bitVector; // bit vector to store the bloom filter
    std::vector<std::string> *blackList; // blacklist to store the strings that are not in the bloom filter

public:
    bloomFilter(int size, int hashCount1, int hashCount2 = 0); // constructor
    ~bloomFilter(); // destructor
    void add(const std::string &input); // add a string to the bloom filter
    bool isContains(const std::string &input); // check if a string is in the bloom filter
    bool isInBlackList(const std::string &input); // check if a string is a false positive

    static bool isValidForCreation(const std::string &input);
    static bool isValidForOperation(const std::string &input);
};

 

#endif /* BLOOM_FILTER_HEADER */



