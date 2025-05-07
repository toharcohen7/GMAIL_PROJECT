/*******************************************************************************
 * @file addUrlToIBF.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef ADDURLTOIBF_HPP
#define ADDURLTOIBF_HPP

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <string> // For std::string

#include "iCommand.hpp"             // iCommand class
#include "immortalBloomFilter.hpp" // immortalBloomFilter class
#include "iOutputHandler.hpp"     // iOutputHandler class
#include "iInputHandler.hpp"     // iInputHandler class

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class addUrlToIBF : public iCommand {

    private:
    immortalBloomFilter *m_ibf; // Pointer to the immortal bloom filter object

public:
    
/*******************************************************************************
    * @brief Constructor for the addUrlToIBF class.
    * @details Empty constructor for the addUrlToIBF class. It initializes the object.
*******************************************************************************/
    addUrlToIBF(immortalBloomFilter *ibf);
  
/*******************************************************************************
    * @brief Destructor for the addUrlToIBF class.
    * @details This destructor cleans up the resources used by the addUrlToIBF object.
    * It is a default destructor and does not require any special cleanup.
*******************************************************************************/
    ~addUrlToIBF() override = default; // Default destructor

/*******************************************************************************
    * @brief Executes the command to add a URL to the immortal bloom filter.
    * @param inputStream The input handler for reading input.
    * @param outputStream The output handler for writing output.
    * @param url The URL to be added to the immortal bloom filter.
    * @details This function adds the URL to the immortal bloom filter and prints a message indicating success.
    * It overrides the execute method in the iCommand class.
 *********************************************************************************/
    void execute(iInputHandler &inputStream, iOutputHandler &outputStream,
                  const std::string &url) override;
};

#endif /* ADDURLTOIBF_HPP */