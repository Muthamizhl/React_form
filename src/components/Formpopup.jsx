// src/components/FormPopup.jsx
import React from 'react';

const FormPopup = ({ data, onClose, onNewForm, onCopy, onDownload, showBackButton }) => {
  // Helper to determine if data is an empty object or null
  const isDataEmpty = !data || Object.keys(data).length === 0;

  return (
    <div className="popup-container">
      <div className="popup-header">
        {/* Only show back button if explicitly requested */}
        {showBackButton && (
          <button className="popup-back-button" onClick={onClose}>
            &larr; Back
          </button>
        )}
        <button className="popup-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
      <div className="popup-content">
        {isDataEmpty ? (
          <>
            <h2>No Form Data Available</h2>
            <p>Please build and submit a form to see its data here.</p>
          </>
        ) : (
          <>
            <h2>Submission Successful!</h2>
            <p>Here is your form data:</p>
            <pre className="json-display">{JSON.stringify(data, null, 2)}</pre>

            <div className="popup-actions">
              {/* --- NEW: Direct Download JSON Button --- */}
              <button className="btn secondary" onClick={() => onDownload('json')}>
                Download JSON
              </button>

              {/* --- Existing: Copy to Clipboard Button --- */}
              <button className="btn secondary" onClick={onCopy}>
                Copy to Clipboard
              </button>

              {/* --- Existing: New Form Button (Primary action) --- */}
              <button className="btn primary" onClick={onNewForm}>
                New Form
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormPopup;