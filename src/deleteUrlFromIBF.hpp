/*******************************************************************************
 * @file deleteUrlFromIBF.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef DELETEURLFROMIBF_HPP
#define DELETEURLFROMIBF_HPP

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

class deleteUrlFromIBF : public iCommand {

    private:
    immortalBloomFilter *m_ibf; // Pointer to the immortal bloom filter object
public:
    
/*******************************************************************************
    * @brief Constructor for the deleteUrlFromIBF class.
    * @param outputStream Output stream for printing messages.
    * @details This constructor initializes the deleteUrlFromIBF object and sets the output stream.
*******************************************************************************/
    deleteUrlFromIBF(immortalBloomFilter *ibf);
  
/*******************************************************************************
    * @brief Destructor for the deleteUrlFromIBF class.
    * @details This destructor cleans up the resources used by the deleteUrlFromIBF object.
    * It is a default destructor and does not require any special cleanup.
*******************************************************************************/
    ~deleteUrlFromIBF() override = default; // Default destructor

/*******************************************************************************
    * @brief Executes the command to delete a URL from the immortal bloom filter.
    * @param inputStream The input handler for reading input.
    * @param outputStream The output handler for writing output.
    * @param url The URL to be deleted from the immortal bloom filter.
    * @details This function deletes the URL from the immortal bloom filter.
    * It also checks if the URL is present in the bloom filter before deletion.
    * It prints a message indicating success or failure.
    * It overrides the execute method in the iCommand class.
 *********************************************************************************/
    void execute(iInputHandler &inputStream, iOutputHandler &outputStream,
        const std::string &url) override;
};

#endif /* DELETEURLFROMIBF_HPP */