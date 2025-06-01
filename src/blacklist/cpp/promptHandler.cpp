#include <iostream>             // For std::cout, std::cin
#include <string>              // For std::string

#include "../hpp/promptHandler.hpp" // Include the header file where promptHandler is defined

std::string promptHandler::getInput() {
    std::string input;
    std::getline(std::cin, input); // Read a line of input from the console
    return input;
}

iOutputHandler &promptHandler::sendOutput(std::string output) {
    *this << output; // Send the output to the console
    return *this;
}

iOutputHandler &promptHandler::operator<<(std::string output) {
    std::cout << output; // Send the output to the console
    return *this;
}