/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/
#include <string>                        // string                     //
#include <vector>                       // vector                     //
#include <sstream>                     // istringstream              //
#include <regex>                      // regex                      //
                                     //                            //
#include "runProgram.hpp"           // runProgram class           //
#include "immortalBloomFilter.hpp" // immortalBloomFilter class  //
#include "hashFunc.hpp"           // hashFunc class             //
#include "iInputHandler.hpp"     // iInputHandler class        //
#include "iOutputHandler.hpp"   // iOutputHandler class       //

/*******************************************************************************
 *                        SIGNATURES OF HELP FUNCTIONS                         *
 * ****************************************************************************/

// Function to get user input for the operation
static bool getInputOperation(iInputHandler &inputStream, std::string &operationStr, std::string &url);

// Function to run the operations based on user input
static void runOperations(std::map<std::string, iCommand*> &commands, immortalBloomFilter *ibf, 
                            iInputHandler &inputStream,iOutputHandler &outputStream);

// Function to check if the URL is valid
static bool isValidUrl(const std::string &url);

/*******************************************************************************
 *                               IMPLEMANTATIONS                               *
 * ****************************************************************************/

runProgram::runProgram(std::map<std::string, iCommand*> &commands, immortalBloomFilter *ibf,iInputHandler &inputStream,
     iOutputHandler &outputStream) : m_commands(commands), m_ibf(ibf), m_inputStream(inputStream), m_outputStream(outputStream) {
    // empty constructor
}
    
runProgram::~runProgram() {
    // empty destructor
}

void runProgram::run() {
    
    while (true) {
        runOperations(m_commands ,m_ibf, m_inputStream,m_outputStream); // Run the operations based on user input
    }
}

/*******************************************************************************
 *                               HELP FUNCTIONS                                *
 * ****************************************************************************/

// Function to run the operations based on user input
static void runOperations(std::map<std::string, iCommand*> &commands, immortalBloomFilter *ibf,
                            iInputHandler &inputStream,iOutputHandler &outputStream) {

    std::string operationStr;
    std::string url;

    // Get user input for the operation until valid input is provided
    while (true) {
        if (getInputOperation(inputStream, operationStr, url)) 
        {
            break; // Valid input provided
        }
        else
        {
            outputStream <<"400 Bad Request\n";
        }
    }

    try
    {
        commands.at(operationStr)->execute(ibf, url); // Execute the command based on user input
    }
    catch(const std::exception& e)
    {
        outputStream <<"400 Bad Request\n";
    }
    
}

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
