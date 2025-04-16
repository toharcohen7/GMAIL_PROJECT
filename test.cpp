#include <gtest/gtest.h>
#include "math.h"
#include "bloomFilter.hpp" // Include the header file where bloomFilter is defined

TEST(constractionTest, test1) {
    // Test the constructor with valid parameters
    bloomFilter bf1(100, 3, 5);
    bloomFilter bf2(100, 3);
    EXPECT_THROW(bloomFilter bf3(-3, 3, 5), std::invalid_argument);
    EXPECT_THROW(bloomFilter bf4(3, -9, 5), std::invalid_argument);
    EXPECT_THROW(bloomFilter bf5(3, 5, -15), std::invalid_argument);
    EXPECT_THROW(bloomFilter bf6(10, 0), std::invalid_argument);
}
/*
This test checks the isInBlackList method under diffrent configurations
to observe how changes in the Bloom Filter parameters affect detection.
*/
TEST(isInBlackListTest, Test1) {
    bloomFilter bf1(8, 1, 1);
    bf1.add("www.example.com0");
    EXPECT_TRUE(bf1.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf1.isInBlackList("www.example.com7")); // Not added -> should return false (but might be a false positive)

    bloomFilter bf2(8, 1, 2);
    bf2.add("www.example.com0");
    EXPECT_TRUE(bf2.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf2.isInBlackList("www.example.com11")); // Not added -> should return false

    bloomFilter bf3(8, 1);
    bf3.add("www.example.com0");
    EXPECT_TRUE(bf3.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf3.isInBlackList("www.example.com1")); // Not added -> should return false

    bloomFilter bf4(8, 2);
    bf4.add("www.example.com0");
    EXPECT_TRUE(bf4.isInBlackList("www.example.com0"));  // Added -> should return true
    EXPECT_FALSE(bf4.isInBlackList("www.example.com4")); // Not added -> should return false
}



int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

