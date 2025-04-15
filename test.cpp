#include <gtest/gtest.h>
#include "math.h"
/*
Functional test for the isContain method of bloomFilter.
This test verifies that items added to the bloom filter are detected,
and items not added are (correctly) not detected.
*/
TEST(isContainTest, Test1) {
    bloomFilter bf1(16, 2, 1);
    bf1.add("");
    bf1.add("https://he.wikipedia.org/wiki/URL");

    EXPECT_TRUE(bf1.isContain(""));                                  // Added -> should return true
    EXPECT_TRUE(bf1.isContain("https://he.wikipedia.org/wiki/URL")); // Added -> should return true
    EXPECT_FALSE(bf1.isContain("harel"));                            // Not added -> should return false
    EXPECT_FALSE(bf1.isContain("daniel ganuvi"));                    // Not added -> should return false
}


int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

