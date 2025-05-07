/*******************************************************************************
 * @file searchUrlInIBF.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef SEARCHURLINIBF_HPP
#define SEARCHURLINIBF_HPP

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <string> 

#include "iCommand.hpp"
#include "immortalBloomFilter.hpp" 
#include "iOutputHandler.hpp"
#include "iInputHandler.hpp"

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class searchUrlInIBF : public iCommand {

    private:
    immortalBloomFilter *m_ibf; // Pointer to the immortal bloom filter object

public:
    
/*******************************************************************************
    * @brief Constructor for the searchUrlInIBF class.
    * @param outputStream Output stream for printing messages.
    * @details This constructor initializes the searchUrlInIBF object and sets the output stream.
*******************************************************************************/
    searchUrlInIBF(immortalBloomFilter *ibf);
  
/*******************************************************************************
    * @brief Destructor for the searchUrlInIBF class.
    * @details This destructor cleans up the resources used by the searchUrlInIBF object.
    * It is a default destructor and does not require any special cleanup.
*******************************************************************************/
    ~searchUrlInIBF() override = default; // Default destructor

/*******************************************************************************
    * @brief Executes the command to search a URL in the immortal bloom filter.
    * @param inputStream The input handler for reading input.
    * @param outputStream The output handler for writing output.
    * @param url The URL to be searched in the immortal bloom filter.
    * @details This function searches the URL in the immortal bloom filter and prints a message
    * indicating if the URL is in the bloom filter or not. in case the URL is in the bloom filter:
    * 1. if it is a false positive the program will send "true false"
    * 2. if it is not a false positive the program will send "true true"
    * @note It overrides the execute method in the iCommand class.
 *********************************************************************************/
    void execute(iInputHandler &inputStream, iOutputHandler &outputStream,
        const std::string &url) override;
};

#endif /* SEARCHURLINIBF_HPP */