/*******************************************************************************
 * @file server.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef SERVER_HEADER
#define SERVER_HEADER

/*******************************************************************************
 *                                INCLUDES                                     *
 ******************************************************************************/

#include <sys/socket.h>
#include <stdio.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>

#include "iCommand.hpp"                // iCommand class
#include "addUrlToIBF.hpp"            // addUrlToIBF class
#include "searchUrlInIBF.hpp"        // searchUrlInIBF class
#include "initProgram.hpp"          // initProgram class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "hashFunc.hpp"           // hashFunc class
#include "promptHandler.hpp"     // promptHandler class
#include "runProgram.hpp"
#include "deleteUrlFromIBF.hpp"

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class server
{

private:

    int m_serverSocket; // Socket to listen for incoming connections

public:

/*******************************************************************************
  * @brief Constructor for the server class.
  * @param port Port number for the server.
  * @param socketType Socket type (TCP or UDP).
  * @param addressFamily Address family (IPv4 or IPv6).
  * @param numToListen Number of connections to listen for.
  * @details This constructor initializes the server object with the specified port,
  * socket type, and address family.
  * It also creates a socket for the server using the specified parameters.
 * *****************************************************************************/
    server(int port, int socketType = SOCK_STREAM, int addressFamily = AF_INET, size_t numToListen = 5);

/*******************************************************************************
 * @brief Destructor for the server class.
 * @details This destructor cleans up the resources used by the server object.
 * It closes the socket and releases any allocated resources.
 ******************************************************************************/
    ~server();

/*******************************************************************************
 * @brief Starts the server and listens for incoming connections.
 * @details This function binds the server socket to the specified port and address,
 * and starts listening for incoming connections.
 * It accepts incoming connections and handles them in a loop.
 ******************************************************************************/
    void startServer();
};

#endif /* SERVER_HEADER */
