import { useState } from "react";
import "../styles/upload.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <h1 className="upload-title">Upload Invoice</h1>
        <p className="upload-subtitle">Upload an invoice image to analyze</p>
      </div>

      <div className="upload-controls">
        <input
          className="file-input"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Analyzing..." : "Upload"}
        </button>
      </div>

      {error && (
        <div className="error-box">
          <p>Error: {error}</p>
        </div>
      )}

      {result && (
        <div className="result-box">
          <h2>Invoice Analysis</h2>
          <table>
            <tbody>
              <tr><td>Vendor</td><td>{result.vendor_name}</td></tr>
              <tr><td>Invoice #</td><td>{result.invoice_number}</td></tr>
              <tr><td>Date</td><td>{result.invoice_date}</td></tr>
              <tr><td>Due Date</td><td>{result.due_date}</td></tr>
              <tr><td>Subtotal</td><td>{result.subtotal}</td></tr>
              <tr><td>Tax</td><td>{result.tax}</td></tr>
              <tr><td>Total</td><td>{result.total_amount}</td></tr>
              <tr>
                <td>Status</td>
                <td className={`status-${result.verification_status}`}>
                  {result.verification_status}
                </td>
              </tr>
            </tbody>
          </table>

          {result.line_items?.length > 0 && (
            <>
              <h3>Line Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.line_items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unit_price}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {result.discrepancies?.length > 0 && (
            <div className="discrepancies">
              <h3>Discrepancies Found</h3>
              <ul>
                {result.discrepancies.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
