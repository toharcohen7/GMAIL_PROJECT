# Project Milestones

This document outlines the key milestones achieved during the development of the Gmail Project.

## Milestone 1: Initial Setup

- **Branch**: `GPDTH-99-branch-for-milestone-1`
- **Description**:  
  - Implemented a Bloom Filter and related functionality in C++.
  - Developed the main program (`runProg`) and a test suite (`runTest`) using GoogleTest.

---

## Milestone 2: Client-Server Architecture

- **Branch**: `GPDTH-165-branch-for-milestone-2`
- **Description**:  
  - Extended the Bloom Filter functionality to a client-server architecture.
  - Created a C++ server (`runServer`) and a Python client (`client.py`) for communication.
  - Added scripts for running the server and client.
  - Enhanced the test suite (`runTest`) using GoogleTest.

---

## Milestone 3: Backend Development

- **Branch**: `GPDTH-218-branch-for-milestone-3`
- **Description**:  
  - Focused on the server-side of the Gmail Project, implementing backend infrastructure and security.
  - Developed the **Bloom Filter Server (C++)** to maintain a persistent Bloom filter for managing blacklisted URLs.
  - Created the **Node.js Gmail Server** to provide Gmail-like application logic and REST API endpoints.
  - Integrated the Bloom Filter Server with the Node.js Gmail Server for URL validation.
  - Added scripts for running the backend services.

---

## Milestone 4: Full System Integration

- **Branch**: `GPDTH-323-branch-for-milestone-4`
- **Description**:  
  - Integrated the server-side backend infrastructure with the React-based frontend.
  - Developed the **React Client** to provide a user-friendly interface for managing emails, labels, drafts, and blacklisted URLs.
  - Ensured seamless communication between the frontend and backend components.
  - Built a secure and scalable email management system with robust URL filtering.

---

For more details on each milestone, refer to the respective branch in the repository.