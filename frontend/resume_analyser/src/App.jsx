import { useState } from "react";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [atsScore, setAtsScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  const [isUploading, setIsUploading] = useState(false);
  const [aiAnalysis, setAiAnalysis] =useState("");

const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const uploadResume = async () => {
    if (!selectedFile) {
      setMessage("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      setIsUploading(true);

      const response = await fetch(
        "https://ai-resume-analyzer-backend-0jor.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setMessage(`Uploaded: ${data.fileName}`);
      setResumeText(data.extractedText);
    } catch (error) {
      console.error(error);

      setMessage("Upload failed.");
      setResumeText("");
    } finally {
      setIsUploading(false);
    }
  };

    const analyzeWithAI = async () => {

  try {

    setIsAnalyzing(true);

    const response =
      await fetch(
        "https://ai-resume-analyzer-backend-0jor.onrender.com/ai-analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            resumeText,
            jobDescription
          })
        }
      );

    const data =
      await response.json();

    setAiAnalysis(
      data.analysis
    );

  } catch (error) {

    console.error(error);

  } finally {

    setIsAnalyzing(false);

  }

};

  return (
  <div
    style={{
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial",
    }}
  >
    <h1>Resume Analyzer</h1>

    <input
      type="file"
      accept=".pdf"
      onChange={handleFileSelect}
    />

    <br />
    <br />

    <button
      onClick={uploadResume}
      disabled={isUploading}
    >
      {isUploading ? "Uploading..." : "Upload Resume"}
    </button>

    <p>{message}</p>

    {selectedFile && (
      <div>
        <h3>Selected File</h3>

        <p>Name: {selectedFile.name}</p>

        <p>
          Size: {(selectedFile.size / 1024).toFixed(2)} KB
        </p>
      </div>
    )}

    <div style={{ marginTop: "30px" }}>
      <h2>Job Description</h2>

      <textarea
        rows="10"
        cols="100"
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
      />
    </div>

    <br />

    <button
      onClick={analyzeWithAI}
      style={{
        marginLeft: "10px"
      }}
    >
      {isAnalyzing
        ? "Analyzing..."
        : "Analyze With AI"}
    </button>

    {resumeText && (
      <div style={{ marginTop: "30px" }}>
        <h2>Extracted Resume Text</h2>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            textAlign: "left",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          {resumeText}
        </pre>
      </div>
    )}

    {atsScore !== null && (
      <div style={{ marginTop: "30px" }}>
        <h2>ATS Score: {atsScore}%</h2>

        <h3>Matched Skills</h3>

        <ul>
          {matchedSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        <h3>Missing Skills</h3>

        <ul>
          {missingSkills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>
    )}

    {aiAnalysis && (
      <div
        style={{
          marginTop: "30px"
        }}
      >
        <h2>AI Analysis</h2>

        <pre
          style={{
            whiteSpace: "pre-wrap",
            textAlign: "left",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px"
          }}
        >
          {aiAnalysis}
        </pre>
      </div>
    )}
  </div>
);
}

export default App;
