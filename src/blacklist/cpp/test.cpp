#include <gtest/gtest.h>
#include "../hpp/bloomFilter.hpp" // Include the header file where bloomFilter is defined
#include "../hpp/immortalBloomFilter.hpp" // Include the header file where immortalBloomFilter is defined
#include "../hpp/hashFunc.hpp"
#include <cstdio> // for remove
#include "../hpp/initProgram.hpp"
#include <thread>
#include "../hpp/server.hpp"
#include "../hpp/socketHandler.hpp"
#include <unistd.h> // For close function

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

/*******************************************************************************
 * Test: immortalBloomFilterTest.constructor
 * Purpose: To validate the constructor and persistence behavior under valid and invalid input.
 * - Verifies construction with a valid set of hash functions and sizes.
 * - Ensures that invalid parameters throw the correct exceptions.
 * - Ensures that data persists after destruction and is revived correctly.
 ******************************************************************************/

// Helper to clean up persistent files before/after test
void cleanupImmortalFiles() {
    std::remove("./data/blackListFile.txt");
}

TEST(immortalBloomFilterTest, constructor) {
    cleanupImmortalFiles(); // Ensure clean start

    std::vector<hashFunc> hashFunctions;
    hashFunctions.push_back(hashFunc(hashFunction, 2));
    size_t filterSize = 8;

    // Create, then add and then delete the filter (In order to simulate 2 runs)
    { 
        immortalBloomFilter* ibf = new immortalBloomFilter(filterSize, hashFunctions);
        ibf->add("https://check1.me");
        ibf->add("https://check2.me");
        delete ibf;
    }
    // 2. Revive and check
    {
        immortalBloomFilter* revived = new immortalBloomFilter(filterSize, hashFunctions);
        EXPECT_TRUE(revived->isContains("https://check1.me"));
        EXPECT_TRUE(revived->isInBlackList("https://check1.me"));
        EXPECT_TRUE(revived->isContains("https://check2.me"));
        EXPECT_TRUE(revived->isInBlackList("https://check2.me"));
        delete revived;
    }

    cleanupImmortalFiles(); // Clean up after test
}

TEST(deleteUrlFromIBFTest, deleteFlow) {
    cleanupImmortalFiles(); // Ensure clean start

    std::vector<hashFunc> hashFunctions;
    hashFunctions.push_back(hashFunc(hashFunction, 2));
    size_t filterSize = 8;

    // Create, then add and then delete the filter (In order to simulate 2 runs)
    {
        immortalBloomFilter* ibf = new immortalBloomFilter(filterSize, hashFunctions);
        ibf->add("https://check1.me");
        ibf->remove("https://check1.me");
        EXPECT_TRUE(ibf->isContains("https://check1.me"));
        EXPECT_FALSE(ibf->isInBlackList("https://check1.me"));
        delete ibf;
    }  
    // 2. Revive and check again
    {
        immortalBloomFilter* revived = new immortalBloomFilter(filterSize, hashFunctions);
        revived->add("https://check2.me");
        revived->remove("https://check2.me");
        EXPECT_TRUE(revived->isContains("https://check2.me"));
        EXPECT_FALSE(revived->isInBlackList("https://check2.me"));
        delete revived;
    }  
    cleanupImmortalFiles(); // Clean up after test
}

/*******************************************************************************
 * Test: SocketHandlerTest.serverIntegration
 * Purpose: To test the server.
 * - Validates that the server can accept a connection and respond correctly.
 * - Ensures that the server can handle a POST request and return the expected response.
 * - Verifies that the server can handle multiple requests in a single run.
 ******************************************************************************/

TEST(SocketHandlerTest, BasicFunctionality) {
    int port = 12345;

    // Mock iRunnable implementation
    class MockRunnable : public iRunnable {
    public:
        void run(iInputHandler &input, iOutputHandler &output) override {
            std::string clientMessage = input.getInput();
            EXPECT_EQ(clientMessage, "Hello, Server!");
            output.sendOutput("Hello, Client!");
        }
    };

    MockRunnable mockRunnable;

    // Start the server in a separate thread using your server class
    std::thread serverThread([&]() {
        server s(port, mockRunnable);
        s.startServer();
    });

    // Allow the server to start
    std::this_thread::sleep_for(std::chrono::milliseconds(200));

    // Simulate a client connection
    int clientSocket = socket(AF_INET, SOCK_STREAM, 0);
    ASSERT_NE(clientSocket, -1) << "Failed to create client socket";

    struct sockaddr_in serverAddr;
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(port);
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    ASSERT_EQ(connect(clientSocket, (struct sockaddr *)&serverAddr, sizeof(serverAddr)), 0)
        << "Failed to connect to server";

    // Send a message to the server
    const char *message = "Hello, Server!";
    send(clientSocket, message, strlen(message), 0);

    // Receive a response from the server
    char buffer[4096] = {0};
    recv(clientSocket, buffer, sizeof(buffer), 0);
    EXPECT_STREQ(buffer, "Hello, Client!");

    close(clientSocket);

    // Stop the server thread (optional: you may want to add a mechanism to stop the server cleanly)
    serverThread.detach();
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}


