# AI Resume Analyzer

An AI-powered Resume Analyzer built using React, Express.js, and Google's Gemini API. The application allows users to upload a PDF resume, compare it against a job description, and receive AI-generated feedback including ATS score estimation, skill gap analysis, strengths, weaknesses, and improvement suggestions.

## Features

* Upload resumes in PDF format
* Extract text from uploaded PDFs
* Compare resumes against job descriptions
* AI-powered resume analysis using Gemini API
* ATS score estimation
* Skill match and skill gap detection
* Resume improvement recommendations

## Tech Stack

### Frontend

* React.js
* JavaScript
* Fetch API
* CSS

### Backend

* Node.js
* Express.js
* Multer
* PDF-Parse

### AI Integration

* Google Gemini API

### Tools

* Git
* GitHub
* VS Code

## How It Works

1. User uploads a PDF resume.
2. The backend receives the file using Multer.
3. PDF-Parse extracts text from the resume.
4. The extracted resume text and job description are sent to Gemini AI.
5. Gemini analyzes the resume and generates feedback.
6. Results are displayed on the React frontend.

## Project Structure

resume_analyser/

├── backend/

│   ├── server.js

│   ├── uploads/

│   └── package.json

│

├── frontend/

│   └── resume_analyser/

│       ├── src/

│       ├── public/

│       └── package.json

│

└── README.md

## Installation

### Clone Repository

git clone <repository-url>

cd ai-resume-analyzer

### Backend Setup

cd backend

npm install

Create a .env file:

GEMINI_API_KEY=YOUR_API_KEY

Start Backend:

node server.js

### Frontend Setup

cd frontend/resume_analyser

npm install

npm run dev

Frontend runs on:

http://localhost:5173

Backend runs on:

http://localhost:3000

## What I Learned

Through this project I learned:

* React fundamentals and state management
* File uploads using FormData
* Building REST APIs with Express.js
* PDF processing and text extraction
* Working with external APIs
* AI integration using Gemini
* Environment variables and API security
* Git and GitHub workflows
* Full-stack application development

## Future Improvements

* Better ATS scoring algorithm
* Support for DOCX resumes
* Authentication and user accounts
* Resume history and analytics
* Improved UI/UX
* Cloud deployment

## Author

Built as a learning project to explore full-stack web development and AI integration.
