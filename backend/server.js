require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const app = express();
const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

const model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

app.use(cors());
app.use(express.json());

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueFileName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueFileName);
  }
});

const upload = multer({
  storage
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running"
  });
});

// PDF Upload Route
app.post("/upload", upload.single("resume"), async (req, res) => {
  try {

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    console.log("\n===== PDF RECEIVED =====");
    console.log("Original Name:", req.file.originalname);
    console.log("Saved Name:", req.file.filename);
    console.log("========================\n");

    // Read uploaded PDF
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const pdfData = await pdf(pdfBuffer);

    console.log("\n===== EXTRACTED TEXT =====");
    console.log(pdfData.text.substring(0, 500));
    console.log("==========================\n");

    res.json({
      success: true,
      fileName: req.file.originalname,
      extractedText: pdfData.text
    });

  } catch (error) {

    console.error("PDF Processing Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process PDF"
    });

  }
});
app.post("/analyze", (req, res) => {

  const { resumeText, jobDescription } = req.body;
  console.log("===== ANALYZE REQUEST =====");
console.log("Job Description:");
console.log(jobDescription);

console.log("\nResume Text:");
console.log(resumeText.substring(0, 500));

console.log("==========================");

  const skills = [
    "javascript",
    "react",
    "node",
    "express",
    "html",
    "css",
    "git",
    "github",
    "aws",
    "docker",
    "mongodb",
    "python"
  ];

  const resumeLower =
    resumeText.toLowerCase();

  const jdLower =
    jobDescription.toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  skills.forEach((skill) => {

    const inJob =
      jdLower.includes(skill);

    const inResume =
      resumeLower.includes(skill);

    if (inJob) {

      if (inResume) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }

    }

  });

  const totalRequired =
    matchedSkills.length +
    missingSkills.length;

  const score =
    totalRequired === 0
      ? 0
      : Math.round(
          (matchedSkills.length /
            totalRequired) *
            100
        );

  res.json({
    score,
    matchedSkills,
    missingSkills
  });

});
app.post("/ai-analyze", async (req, res) => {

  try {

    const {
      resumeText,
      jobDescription
    } = req.body;

    const prompt = `
You are a professional ATS system.

Compare the resume against the job description.

Provide:

1. ATS Score (0-100)

2. Matched Skills

3. Missing Skills

4. Strengths

5. Weaknesses

6. Suggestions for Improvement

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    const result =
      await model.generateContent(
        prompt
      );

    const analysis =
      result.response.text();

    res.json({
      success: true,
      analysis
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "AI Analysis Failed"
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});