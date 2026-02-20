import { useState } from "react";
import "../styles/upload.css";

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.text);
      setExtractedText(data.text);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-box">
        <h2 className="upload-title">Upload Invoice</h2>
        <p className="upload-subtitle">
          Start uploading the invoice here to get a result
        </p>
        <p className="upload-subtitle">
          Currently just supports image files such as .jpg, .jpeg, and .png
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />

        <button className="upload-button" onClick={handleFileUpload}>
          Upload
        </button>

        {extractedText && (
          <div className="extracted-text">
            <h3>Extracted Text:</h3>
            <pre>{extractedText}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
