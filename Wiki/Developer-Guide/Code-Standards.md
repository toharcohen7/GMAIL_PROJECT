# Code Standards

This document outlines the coding standards and best practices for contributing to the Gmail Project.

## General Guidelines

- Write clean, readable, and self-documenting code
- Follow the principle of DRY (Don't Repeat Yourself)
- Prioritize clarity over cleverness
- Write code with testability in mind
- Comment complex logic, but let well-named functions and variables speak for themselves
- Keep functions small and focused on a single task
- Limit line length to 100 characters where possible

## JavaScript Standards (React & Node.js)

### Style Guide

We follow these JavaScript style conventions:

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons at the end of statements
- Use ES6+ features where appropriate
- Follow camelCase for variables and functions
- Follow PascalCase for components

### File Organization

#### React Client

- Organize components by feature or function
- One component per file
- Group related utilities in utility files
- Use consistent file naming conventions:
  - React components: PascalCase.js (e.g., `EmailList.js`)
  - Utilities/hooks: camelCase.js (e.g., `formatDate.js`)
  - Constants: UPPER_SNAKE_CASE.js (e.g., `API_ENDPOINTS.js`)
  - CSS: ComponentName.css (matching the component name)

#### Node.js Server

- Organize files by purpose (controllers, services, routes, models)
- Use descriptive filenames that reflect the contained functionality
- Follow MVC pattern where appropriate

### Component Structure

```jsx
// Imports ordered by: React, external libraries, internal components, styles
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import MessageList from './MessageList';
import { FetchWithAuth } from '../FetchWithAuth/FetchWithAuth';
import { buildApiUrl } from '../../config/api';
import './ComponentName.css';

/**
 * Component description
 */
function ComponentName({ prop1, prop2 }) {
  // State declarations
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Effects
  useEffect(() => {
    // Effect logic
    loadData();
  }, [prop1]);
  
  // Event handlers
  const handleClick = (item) => {
    // Handler logic
  };
  
  // Helper functions
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await FetchWithAuth(buildApiUrl('api/endpoint'));
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        setError('Failed to load data');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Conditional rendering
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={loadData} />;
  if (data.length === 0) return <EmptyState />;
  
  // Main render
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
}

export default ComponentName;
```

### React Best Practices

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks or utility functions
- Use prop destructuring
- Handle errors gracefully
- Follow consistent state management patterns
- Use Bootstrap and Bootstrap Icons for UI components
- Implement proper loading, error, and empty states

### Node.js Best Practices

- Use async/await for asynchronous operations
- Implement proper error handling
- Use middleware for cross-cutting concerns
- Keep controllers thin, move business logic to services
- Validate and sanitize input data
- Follow RESTful API design principles
- Use environment variables for configuration

## C++ Standards

### Style Guide

We follow these C++ coding conventions:

- Use 4 spaces for indentation
- Maximum line length of 100 characters
- Use PascalCase for class names
- Use camelCase for methods and variables
- Include comprehensive comments using `/* */` style

### Header File Structure

```cpp
/*******************************************************************************
 * @file fileName.hpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#ifndef FILE_NAME_HPP
#define FILE_NAME_HPP

/*******************************************************************************
 *                                INCLUDES                                     *
 * ****************************************************************************/

#include <standard_library>
#include "project_header.hpp"

/*******************************************************************************
 *                                CLASS                                        *
 * ****************************************************************************/

class ClassName {
public:
    // Constructor/Destructor
    ClassName();
    ~ClassName();
    
    // Public methods
    bool methodName(const std::string& param);
    
private:
    // Private methods
    void privateMethod();
    
    // Member variables
    int m_memberVariable;
};

#endif /* FILE_NAME_HPP */
```

### Implementation File Structure

```cpp
/*******************************************************************************
 * @file fileName.cpp
 * submitted by:
 * Daniel Jenudi 318852571
 * Harel Mizrahi 322809922
 * Tohar Yahakov Cohen 211466743
*******************************************************************************/

#include "fileName.hpp"

/*******************************************************************************
 *                       Constructor & Destructor                              *
 * ****************************************************************************/

ClassName::ClassName() : m_memberVariable(0) {
    // Constructor implementation
}

ClassName::~ClassName() {
    // Destructor implementation
}

/*******************************************************************************
 *                          Public Methods                                    *
 * ****************************************************************************/

bool ClassName::methodName(const std::string& param) {
    // Method implementation
    return true;
}

/*******************************************************************************
 *                          Private Methods                                   *
 * ****************************************************************************/

void ClassName::privateMethod() {
    // Private method implementation
}
```

### C++ Best Practices

- Use modern C++ features (C++17)
- Prefer standard library containers and algorithms
- Use smart pointers for memory management
- Write thread-safe code
- Handle errors appropriately
- Implement proper logging
- Write comprehensive unit tests
- Use CMake for build configuration

## Testing Guidelines

### JavaScript Testing

- Test React components using Jest and React Testing Library
- Test API endpoints with integration tests
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Test both success and failure paths

### C++ Testing

- Use Google Test framework
- Create thorough unit tests for all classes
- Test edge cases and error conditions
- Create setup and teardown

## Documentation

- Document public APIs and functions
- Include meaningful comments for complex logic
- Keep README files updated
- Document architecture decisions
- Include examples for complex functionalities

## Version Control

- Make small, focused commits
- Write descriptive commit messages
- Use feature branches for new work
- Create pull requests for code reviews
- Resolve merge conflicts carefully