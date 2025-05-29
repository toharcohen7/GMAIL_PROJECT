/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/
#include <string>                                  // string                     //
#include <vector>                                 // vector                     //
#include <sstream>                               // istringstream              //
#include <regex>                                // regex                      //
                                               //                            //
#include "../hpp/runProgram.hpp"              // runProgram class           //
#include "../hpp/immortalBloomFilter.hpp"    // immortalBloomFilter class  //
#include "../hpp/iInputHandler.hpp"         // iInputHandler class        //
#include "../hpp/iOutputHandler.hpp"       // iOutputHandler class       //
#include "../hpp/iCommand.hpp"            // iCommand class             //
#include "../hpp/addUrlToIBF.hpp"        // addUrlToIBF class          //
#include "../hpp/searchUrlInIBF.hpp"    // searchUrlInIBF class       //
#include "../hpp/deleteUrlFromIBF.hpp" // deleteUrlFromIBF class     //

/*******************************************************************************
 *                        SIGNATURES OF HELP FUNCTIONS                         *
 * ****************************************************************************/

// Function to get user input for the operation
static bool getInputOperation(iInputHandler &inputStream, std::string &operationStr, std::string &url);

// Function to run the operations based on user input
static void runOperations(std::map<std::string, iCommand*> &commands, iInputHandler &inputStream,
                            iOutputHandler &outputStream);

// Function to check if the URL is valid
static bool isValidUrl(const std::string &url);

/*******************************************************************************
 *                               IMPLEMANTATIONS                               *
 * ****************************************************************************/

runProgram::runProgram(immortalBloomFilter *ibf) 
    : m_ibf(ibf) {
    
        m_commands["POST"] = new addUrlToIBF(m_ibf); // Add URL command
        m_commands["GET"] = new searchUrlInIBF(m_ibf); // Search URL command
        m_commands["DELETE"] = new deleteUrlFromIBF(m_ibf); // Delete URL command
}
    
runProgram::~runProgram() {
    // Clean up dynamically allocated memory
    for (auto &command : m_commands) {
        delete command.second; // Delete each command object
    }
    m_commands.clear(); // Clear the map
}

void runProgram::run(iInputHandler &inputStream, iOutputHandler &outputStream) {
    
    std::string operationStr;
    std::string url;

    // Get user input for the operation until valid input is provided
    

    if (!getInputOperation(inputStream, operationStr, url)) 
    {
        outputStream <<"400 Bad Request";
        return; // Exit if input is invalid
    }

    try
    {
        std::lock_guard<std::mutex> lock(m_mutex); // Lock the mutex to ensure thread safety
        m_commands.at(operationStr)->execute(inputStream, outputStream, url); // Execute the command based on user input
    }
    catch(const std::exception& e)
    {
        outputStream <<"400 Bad Request";
    }
}

/*******************************************************************************
 *                               HELP FUNCTIONS                                *
 * ****************************************************************************/

// Function to get user input for the operation
static bool getInputOperation(iInputHandler &inputStream, std::string &operationStr, std::string &url) {

    std::string line; 
    line = inputStream.getInput(); // Get user input from the input stream

    std::istringstream iss(line);

    // check if the first part is a valid word
    if (!(iss >> operationStr)) {
        return false;
    }

    // check if the second part is a valid word
    if (!(iss >> url)) {
        return false;
    }

    // Check if there are any extra characters after the word
    std::string extra;
    if (iss >> extra) {
        return false;
    }
    
    return isValidUrl(url); // Check if the URL is valid
}

static bool isValidUrl(const std::string &url) {
    const std::regex urlPattern(
        R"(^(?:(?:file:///(?:[A-Za-z]:)?(?:/[^\s])?)|(?:(?:[A-Za-z][A-Za-z0-9+.\-])://)?(?:localhost|(?:[A-Za-z0-9\-]+\.)+[A-Za-z0-9\-]+|(?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:/[^\s]*)?)$)");
    return std::regex_match(url, urlPattern);
}
