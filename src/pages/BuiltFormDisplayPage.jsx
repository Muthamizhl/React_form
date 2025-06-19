// Updated BuiltFormDisplayPage.jsx with required moved to end and min/max validation customization
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FormPopup from '../components/Formpopup';
import '../styles/Pop.css';
import Footer from '../components/common/Footer';
import '../styles/BuiltFormDisplayPage.css';

const BuiltFormDisplayPage = () => {
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [showSubmissionPopup, setShowSubmissionPopup] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const storedSchema = localStorage.getItem('builtFormSchema');
    if (storedSchema) {
      setFormSchema(JSON.parse(storedSchema));
    } else {
      alert('No form schema found! Please build a form first.');
      navigate('/build');
    }
  }, [navigate]);

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    setSubmittedData(data);
    setShowSubmissionPopup(true);
  };

  const handleNewForm = () => {
    setShowSubmissionPopup(false);
    reset();
  };

  const handleCopyData = () => {
    if (submittedData) {
      navigator.clipboard.writeText(JSON.stringify(submittedData, null, 2))
        .then(() => alert('Submitted data copied to clipboard!'))
        .catch(err => console.error('Failed to copy text: ', err));
    }
  };

  const handleDownloadData = () => {
    if (submittedData) {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(submittedData, null, 2)], { type: "application/json" });
      element.href = URL.createObjectURL(file);
      element.download = "submitted-form-data.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  if (!formSchema) return <p className="loading-message">Loading form...</p>;

  const renderFormField = (field) => {
    const fieldName = field.name || `${field.label.toLowerCase().replace(/\s/g, '_')}_${field.id ? field.id.replace('field-', '').slice(-6) : Math.random().toString(36).substr(2, 6)}`;

    const validationRules = {
      minLength: field.minLength > 0 ? { value: field.minLength, message: `Minimum length is ${field.minLength}` } : undefined,
      maxLength: field.maxLength > 0 ? { value: field.maxLength, message: `Maximum length is ${field.maxLength}` } : undefined,
      min: field.min ? { value: Number(field.min), message: `Minimum value is ${field.min}` } : undefined,
      max: field.max ? { value: Number(field.max), message: `Maximum value is ${field.max}` } : undefined,
      pattern: field.type === 'email' ? { value: /^\S+@\S+\.\S+$/i, message: 'Invalid email address' } : undefined,
      required: field.required ? `${field.label} is required` : false
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <input
              type={field.type === 'phone' ? 'tel' : field.type}
              placeholder={field.placeholder || ''}
              {...register(fieldName, validationRules)}
            />
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      case 'textarea':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <textarea
              placeholder={field.placeholder || ''}
              {...register(fieldName, validationRules)}
              rows="4"
            ></textarea>
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      case 'radio':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <div className="radio-options-container">
              {field.options && field.options.map((option, idx) => (
                <label key={idx} className="radio-option">
                  <input type="radio" value={option} {...register(fieldName, validationRules)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      case 'checkbox':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <div className="checkbox-options-container">
              {field.options && field.options.map((option, idx) => (
                <label key={idx} className="checkbox-option">
                  <input type="checkbox" value={option} {...register(fieldName, validationRules)} />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      case 'select':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <select {...register(fieldName, validationRules)}>
              <option value="">{field.placeholder || `Select ${field.label}`}</option>
              {field.options && field.options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      case 'date':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <input type="date" {...register(fieldName, validationRules)} />
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      case 'time':
        return (
          <div key={field.id} className="form-field-group">
            <label>{field.label} {field.required && <span className="required-star">*</span>}</label>
            <input type="time" {...register(fieldName, validationRules)} />
            {errors[fieldName] && <p className="error-message">{errors[fieldName].message}</p>}
          </div>
        );
      default:
        return <p key={field.id} className="error-message">Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div className="built-form-page-container">
      <button className="back-button" onClick={() => navigate('/build')}>
        &larr; Back to Builder
      </button>
      <div className="built-form-content">
        <h1 className="form-display-title">{formSchema.formTitle}</h1>
        {formSchema.formDescription && <p className="form-display-description">{formSchema.formDescription}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="dynamic-form">
          {formSchema.fields.map(field => renderFormField(field))}
          <button type="submit" className="btn primary submit-form-btn">Submit Form</button>
        </form>
        {showSubmissionPopup && submittedData && (
          <div className={`popup-overlay ${showSubmissionPopup ? 'show' : ''}`}>
            <FormPopup
              data={submittedData}
              onClose={() => setShowSubmissionPopup(false)}
              onCopy={handleCopyData}
              onDownload={handleDownloadData}
              onNewForm={handleNewForm}
              showBackButton={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuiltFormDisplayPage;