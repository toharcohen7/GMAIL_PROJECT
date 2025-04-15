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

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

