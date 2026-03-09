import React from 'react';

const InvoiceDetails = ({ invoice, onBack }) => {
  if (!invoice) return null;

  return (
    <div style={{ backgroundColor: '#f0f1f4', borderRadius: '20px', padding: '40px', minHeight: '80vh', display: 'flex', justifyContent: 'center' }}>
      
      {/* Green Container mimicking Figma */}
      <div style={{ backgroundColor: '#1abc9c', borderRadius: '20px', padding: '40px', display: 'flex', gap: '40px', maxWidth: '1000px', width: '100%' }}>
        
        {/* Left Side: The PDF/Image Viewer */}
        <div style={{ flex: 1, backgroundColor: '#16a085', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ color: '#000', textAlign: 'center', marginBottom: '10px' }}>Invoice test.pdf</h3>
          
          {/* Placeholder for actual image/PDF. Will show an empty white box for now */}
          <div style={{ backgroundColor: '#fff', flex: 1, minHeight: '500px', padding: '20px' }}>
            <p style={{ color: '#ccc', textAlign: 'center', marginTop: '50%' }}>[Invoice Document Viewer]</p>
          </div>
        </div>

        {/* Right Side: The AI Explanation */}
        <div style={{ flex: 1, color: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '3rem', color: '#f1c40f', marginBottom: '10px' }}>
            {invoice.status?.toLowerCase() === 'valid' ? 'Valid' : invoice.status?.toLowerCase() === 'flagged' ? 'Flagged' : 'Review'}
          </h1>
          <h3 style={{ color: '#c0392b', marginBottom: '20px' }}>explanation:</h3>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'left', marginBottom: 'auto' }}>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."
            <br/><br/>
            {/* You can inject real explanation data here later: {invoice.ai_explanation} */}
          </p>

          <button 
            onClick={onBack}
            style={{ backgroundColor: '#f1c40f', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
};

export default InvoiceDetails;