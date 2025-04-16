#include <gtest/gtest.h>
#include "bloomFilter.hpp" // Include the header file where bloomFilter is defined

/*      
Smoke test for the add function of bloomFilter.
This test ensures that calling add with various strings (including empty and URL) does not crash or throw exceptions.
*/
TEST(AddTest, HandlesVariousInputStrings) {
    bloomFilter bf1(16,2,1);
    bf1.add("harel");
    bf1.add("daniel");
    bf1.add("tohar");
    bf1.add("");
    bf1.add("https://he.wikipedia.org/wiki/URL");
}

/*
Test to check the contractor behavior with various inputs.
*/
TEST(ConstructionTest, HandlesValidAndInvalidParameters) {
    // Test the constructor with valid parameters
    bloomFilter bf1(100, 3, 5);
    bloomFilter bf2(100, 3);
    // Test the constructor with unvalid parameters
    EXPECT_THROW(bloomFilter bf3(-3, 3, 5), std::invalid_argument); // Negative size
    EXPECT_THROW(bloomFilter bf4(3, -9, 5), std::invalid_argument); // Negative number of hash functions
    EXPECT_THROW(bloomFilter bf5(3, 5, -15), std::invalid_argument); // Negative seed
    EXPECT_THROW(bloomFilter bf6(10, 0), std::invalid_argument); // Zero hash functions
}

/*
Functional test for the isContain method of bloomFilter.
This test verifies that items added to the bloom filter are detected,
and items not added are (correctly) not detected.
*/
TEST(IsContainTest, CorrectlyIdentifiesPresentAndAbsentStrings) {
    bloomFilter bf1(16, 2, 1);
    bf1.add("");
    bf1.add("https://he.wikipedia.org/wiki/URL");

    EXPECT_TRUE(bf1.isContains(""));                                  // Added -> should return true
    EXPECT_TRUE(bf1.isContains("https://he.wikipedia.org/wiki/URL")); // Added -> should return true
    EXPECT_FALSE(bf1.isContains("harel"));                            // Not added -> should return false
    EXPECT_FALSE(bf1.isContains("daniel ganuvi"));                    // Not added -> should return false
}
  

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

