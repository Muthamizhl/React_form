import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DemoFormPage.css";
import FormPopup from "../components/Formpopup";
import "../styles/Pop.css";

const DemoFormPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    qualification: "",
    experience: "",
    gender: "",
    jobInfo: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showJsonConfig, setShowJsonConfig] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic presence check
    const isFilled = Object.values(formData).every((val) => val.trim() !== "");
    if (!isFilled) {
      alert("Please fill in all fields.");
      return;
    }

    // Name validation
    if (!/^[a-zA-Z\s]{3,50}$/.test(formData.name)) {
      alert("Name must be 3-50 characters long and contain only letters and spaces.");
      return;
    }

    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // Age validation
    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 18 || age > 60) {
      alert("Age must be a number between 18 and 60.");
      return;
    }

    // Qualification validation
    if (formData.qualification.trim().length < 2) {
      alert("Qualification must be at least 2 characters long.");
      return;
    }

    // Experience validation
    if (!["Fresher", "Experienced"].includes(formData.experience)) {
      alert("Please select your work experience.");
      return;
    }

    // Gender validation
    if (!["Male", "Female"].includes(formData.gender)) {
      alert("Please select your gender.");
      return;
    }

    // Job Info validation
    if (formData.jobInfo.trim().length < 10) {
      alert("Job description must be at least 10 characters long.");
      return;
    }

    // ✅ Passed all checks
    setShowPopup(true);
  };

  const handleClear = () => {
    setFormData({
      name: "",
      phone: "",
      age: "",
      qualification: "",
      experience: "",
      gender: "",
      jobInfo: "",
    });
    setShowPopup(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    alert("Copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(formData, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "form-data.json";
    document.body.appendChild(element);
    element.click();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="form-page-container">
      <button className="back-button" onClick={handleBack}>
        &larr; Back
      </button>

      <div className="form-container">
        <h2 className="form-title">Job Application Form</h2>
        <p className="form-desc">Please fill in the required details to apply.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter 10-digit phone number"
                required
              />
            </div>

          <div className="form-group">
  <label>Age*</label>
  <input
    type="number"
    name="age"
    value={formData.age}
    onChange={(e) => {
      const value = e.target.value;
      if (value.length <= 2) {
        handleChange(e);
      }
    }}
 
                maxLength="2"
    placeholder="Enter your age"
    required
  />
</div>


            <div className="form-group">
              <label>Qualification*</label>
              <input
                type="text"
                name="qualification"
                placeholder="Enter your highest qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group radio-group">
              <label>Work Experience*</label>
              <div className="radio-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="experience"
                    value="Fresher"
                    onChange={handleChange}
                    checked={formData.experience === "Fresher"}
                  />
                  <span>Fresher</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="experience"
                    value="Experienced"
                    onChange={handleChange}
                    checked={formData.experience === "Experienced"}
                  />
                  <span>Experienced</span>
                </label>
              </div>
            </div>

            <div className="form-group radio-group">
              <label>Gender*</label>
              <div className="radio-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    onChange={handleChange}
                    checked={formData.gender === "Male"}
                  />
                  <span>Male</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    onChange={handleChange}
                    checked={formData.gender === "Female"}
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div className="form-group full-width">
              <label>About the Job*</label>
              <textarea
                name="jobInfo"
                value={formData.jobInfo}
                onChange={handleChange}
                placeholder="Describe the job according to you...."
                required
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary">Submit</button>
            <button type="button" className="btn-secondary" onClick={handleClear}>
              Clear All
            </button>
          </div>
        </form>

        <button className="json-btn" onClick={() => setShowJsonConfig(true)}>
          JSON Config
        </button>

        {showPopup && (
          <div className={`popup-overlay ${showPopup ? 'show' : ''}`}>
            <FormPopup
              data={formData}
              onClose={() => setShowPopup(false)}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onNewForm={handleClear}
              showBackButton={false}
            />
          </div>
        )}

        {showJsonConfig && (
          <div className={`popup-overlay ${showJsonConfig ? 'show' : ''}`}>
            <FormPopup
              data={{
                formTitle: "JSON Configuration Structure",
                fields: [
                  { label: "Name", type: "text", required: true },
                  { label: "Phone", type: "tel", required: true },
                  { label: "Age", type: "number", required: true },
                  { label: "Qualification", type: "text", required: true },
                  { label: "Work Experience", type: "radio", values: ["Fresher", "Experienced"] },
                  { label: "Gender", type: "radio", values: ["Male", "Female"] },
                  { label: "Job Info", type: "textarea", required: true },
                ]
              }}
              onClose={() => setShowJsonConfig(false)}
              showBackButton={true}
              onCopy={null}
              onDownload={null}
              onNewForm={null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoFormPage;
