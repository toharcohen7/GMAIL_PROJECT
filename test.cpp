#include <gtest/gtest.h>
#include "bloomFilter.hpp"
/*      
Smoke test for the add function of bloomFilter.
This test ensures that calling add with various strings (including empty and URL) does not crash or throw exceptions.
*/
TEST(AddTest, Test1) {
    bloomFilter bf1(16,2,1);
    bf1.add("harel");
    bf1.add("daniel");
    bf1.add("tohar");
    bf1.add("");
    bf1.add("https://he.wikipedia.org/wiki/URL");
}
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

