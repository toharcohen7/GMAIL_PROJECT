#include <gtest/gtest.h>
#include "bloomFilter.hpp" // Include the header file where bloomFilter is defined
#include "hashFunc.hpp"   // Include the header file where hashFunc is defined

size_t hashFunction(const std::string &str);

TEST(hashFuncTest, constractor) {

    // Test the constructor with valid parameters
    hashFunc hf1(hashFunction, 1);
    hashFunc hf2(hashFunction, 2);
    hashFunc hf3(hashFunction, 3);
    hashFunc hf4(hashFunction, 4);
    hashFunc hf5(hashFunction);

    // Test the constructor with invalid parameters
    hashFunc hf6(hashFunction, 0);
}

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

size_t hashFunction(const std::string &str) {
    return std::hash<std::string>()(str);
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

