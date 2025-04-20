#include <gtest/gtest.h>
#include "bloomFilter.hpp" // Include the header file where bloomFilter is defined

#include "hashFunc.hpp"


size_t hashFunction(const std::string &str) {
    return std::hash<std::string>()(str);
}

/*******************************************************************************
 * Test: bloomFilterTest.constructor
 * Purpose: To validate the constructor behavior under valid and invalid input.
 * - Verifies construction with a valid set of hash functions and sizes.
 * - Ensures that invalid parameters (negative size or empty hash functions) 
 *   throw the correct exceptions.
 ******************************************************************************/
TEST(bloomFilterTest, constructor) {
    std::vector<hashFunc> hashFunctions;
    std::vector<hashFunc> emptyHashFunctions;
    hashFunctions.push_back(hashFunc(hashFunction, 3));  
    hashFunctions.push_back(hashFunc(hashFunction, 5)); 
    bloomFilter bf1(8, hashFunctions);                   // Create a valid bloom filter 
    bloomFilter bf2(100, hashFunctions);                 // Create another valid bloom filter
    // Test the constructor with unvalid parameters
    EXPECT_THROW(bloomFilter bf3(0, hashFunctions), std::invalid_argument);      // Zero size
    EXPECT_THROW(bloomFilter bf4(10, emptyHashFunctions), std::invalid_argument); // Zero hash functions
}
/*******************************************************************************
 * Test: bloomFilterTest.AddTest
 * Purpose: Smoke test to verify that the add method accepts various strings
 * without throwing errors or crashing.
 * - Includes regular strings, an empty string, and a URL.
 * - Does not verify actual membership (handled in isContains tests).
 ******************************************************************************/
TEST(bloomFilterTest, AddTest) {
    std::vector<hashFunc> hashFunctions;
    hashFunctions.push_back(hashFunc(hashFunction, 3));
    bloomFilter bf1(16, hashFunctions);
    bf1.add("harel");
    bf1.add("daniel");
    bf1.add("tohar");
    bf1.add("");
    bf1.add("https://he.wikipedia.org/wiki/URL");
}

/*******************************************************************************
 * Test: bloomFilterTest.isInBlackListTest
 * Purpose: To test the behavior of isInBlackList method across different 
 * hash function configurations.
 * - Ensures elements that were added are found.
 * - Validates that elements not added are usually not detected.
 * - Observes potential false positives due to limited filter size.
 ******************************************************************************/
TEST(bloomFilterTest, isInBlackListTest) {
    std::vector<hashFunc> hashFunctions1;
    hashFunctions1.push_back(hashFunc(hashFunction, 1));
    hashFunctions1.push_back(hashFunc(hashFunction, 1));
    bloomFilter bf1(8, hashFunctions1);
    
    bf1.add("www.example.com0");
    EXPECT_TRUE(bf1.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf1.isInBlackList("www.example.com7")); // Not added -> should return false (but might be a false positive)

    std::vector<hashFunc> hashFunctions2;
    hashFunctions2.push_back(hashFunc(hashFunction, 1));
    hashFunctions2.push_back(hashFunc(hashFunction, 2));
    bloomFilter bf2(8, hashFunctions2);
    
    bf2.add("www.example.com0");
    EXPECT_TRUE(bf2.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf2.isInBlackList("www.example.com11")); // Not added -> should return false

    std::vector<hashFunc> hashFunctions3;
    hashFunctions3.push_back(hashFunc(hashFunction, 1));
    bloomFilter bf3(8, hashFunctions3);
    
    bf3.add("www.example.com0");
    EXPECT_TRUE(bf3.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf3.isInBlackList("www.example.com1")); // Not added -> should return false

    std::vector<hashFunc> hashFunctions4;
    hashFunctions4.push_back(hashFunc(hashFunction, 2));
    bloomFilter bf4(8, hashFunctions4);
    
    bf4.add("www.example.com0");
    EXPECT_TRUE(bf4.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf4.isInBlackList("www.example.com4")); // Not added -> should return false
}



/*******************************************************************************
 * Test: bloomFilterTest.IsContainTest
 * Purpose: Functional test for isContains method.
 * - Validates that added elements are detected correctly.
 * - Confirms that unadded elements return false. can be falsePositive
 * - Includes edge cases like an empty string and a full URL.
 ******************************************************************************/
TEST(bloomFilterTest, IsContainTest) {
    std::vector<hashFunc> hashFunctions;
    hashFunctions.push_back(hashFunc(hashFunction, 6));
    bloomFilter bf1(1000, hashFunctions);
    bf1.add("");
    bf1.add("https://he.wikipedia.org/wiki/URL");

    EXPECT_TRUE(bf1.isContains(""));                                  // Added -> should return true
    EXPECT_TRUE(bf1.isContains("https://he.wikipedia.org/wiki/URL")); // Added -> should return true
    EXPECT_FALSE(bf1.isContains("harel"));                            // Not added -> should return false
    EXPECT_FALSE(bf1.isContains("daniel ganuvi"));                    // Not added -> should return false
}

/*******************************************************************************
    * Test: hashFuncTest.constructor
    * Purpose: To validate the constructor behavior under valid and invalid input.
    * - Verifies construction with a valid set of hash functions and sizes.
    * - Ensures that invalid parameters (negative size or empty hash functions)
        throw the correct exceptions.
 ******************************************************************************/

TEST(hashFuncTest, constractor) {

    // Test the constructor with valid parameters
    hashFunc hf1(hashFunction, 1);
    hashFunc hf2(hashFunction, 2);
    hashFunc hf3(hashFunction, 3);
    hashFunc hf4(hashFunction, 4);
    hashFunc hf5(hashFunction);

    // Test the constructor with invalid parameters
    EXPECT_THROW(hashFunc hf6(hashFunction, 0), std::invalid_argument); // timesToHash should be greater than 0
}

/*******************************************************************************
    * Test: hashFuncTest.operatorBrackets
    * Purpose: To test the operator() function of the hashFunc class.
    - Validates that the operator() function returns different hash values for
      different timesToHash values.
    - Ensures that the operator() function works correctly with different strings.
    - Verifies that the operator() function returns different hash values for different hush times.
 ******************************************************************************/


TEST(hashFuncTest, operatorBrackets) {

    // Test the constructor with valid parameters
    hashFunc hf1(hashFunction, 1);
    hashFunc hf2(hashFunction, 2);
    hashFunc hf3(hashFunction, 3);

    hf1("daniel"); // Test with a string
    hf2("harel"); // Test with a string
    hf3("tohar"); // Test with a string


    size_t num1 = hf1("daniel"); // Test with a string
    size_t num2 = hf2("daniel"); // Test with a string
    size_t num3 = hf3("daniel"); // Test with a string
 
    EXPECT_NE(num1, num2); // Different hash values for different timesToHash
    EXPECT_NE(num1, num3); // Different hash values for different timesToHash
    EXPECT_NE(num2, num3); // Different hash values for different timesToHash
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

