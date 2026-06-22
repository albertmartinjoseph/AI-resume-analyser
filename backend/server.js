require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// MEMORY STORAGE (No uploads folder needed)
const storage = multer.memoryStorage();

const upload = multer({
  storage
});

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running"
  });
});

// =====================
// PDF Upload Route
// =====================

app.post(
  "/upload",
  upload.single("resume"),
  async (req, res) => {
    try {

      console.log("UPLOAD ROUTE HIT");

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }

      console.log(
        "File received:",
        req.file.originalname
      );

      const pdfData = await pdf(
        req.file.buffer
      );

      console.log(
        "PDF parsed successfully"
      );

      res.json({
        success: true,
        fileName:
          req.file.originalname,
        extractedText:
          pdfData.text
      });

    } catch (error) {

      console.error(
        "PDF Processing Error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to process PDF"
      });

    }
  }
);

// =====================
// ATS ANALYSIS
// =====================

app.post("/analyze", (req, res) => {

  const {
    resumeText,
    jobDescription
  } = req.body;

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

// =====================
// AI ANALYSIS
// =====================

app.post(
  "/ai-analyze",
  async (req, res) => {

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
        message:
          "AI Analysis Failed"
      });

    }

  }
);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});