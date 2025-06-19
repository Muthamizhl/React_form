// src/components/SortableFormField.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableFormField = ({ field, index, onEdit, onRemove, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Add isDragging to apply visual feedback
  } = useSortable({ id: field.id }); // Use the unique ID of the field

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add visual feedback when dragging
    opacity: isDragging ? 0.6 : 1,
    border: isDragging ? '2px dashed var(--color-primary)' : '',
    boxShadow: isDragging ? '0 0 0 4px rgba(0, 123, 255, 0.2)' : '',
    zIndex: isDragging ? 100 : 'auto', // Bring dragged item to front
  };

  const renderFieldPreviewContent = (field) => {
    // This is the same logic you have in FormBuilderPage.jsx for rendering previews
    // We moved it here for reusability and to keep SortableFormField clean
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return <input type={field.type === 'phone' ? 'tel' : field.type} placeholder={field.placeholder || ''} disabled />;
      case 'number':
        return <input type="number" placeholder={field.placeholder || ''} disabled />;
      case 'textarea':
        return <textarea placeholder={field.placeholder || ''} disabled rows="3"></textarea>;
      case 'radio':
        return (
          <div className="preview-options">
            {(field.options || []).map((opt, i) => (
              <label key={i}><input type="radio" disabled /> {opt}</label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <label className="checkbox-option">
            <input type="checkbox" disabled />
            <span>{field.label}</span> {/* Checkbox label is part of the checkbox itself */}
          </label>
        );
      default:
        return <input type="text" placeholder="Unsupported Field Type" disabled />;
    }
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`form-preview-field ${isEditing ? 'editing' : ''}`}
      onClick={() => onEdit(index)} // Pass the actual index for editing
    >
      <div className="field-preview-header">
        <span>{field.label} {field.required && '*'}</span>
        <div className="field-actions">
          {/* We spread listeners here for the drag handle */}
          <button
            className="icon-btn drag-handle"
            {...listeners} // Listeners for drag
            title="Drag to reorder"
            // Adding a visual drag handle icon
          >
            &#x2261; {/* Hamburger/reorder icon */}
          </button>
          <button className="icon-btn edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(index); }} title="Edit field">✏️</button>
          <button className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); onRemove(index); }} title="Delete field">🗑️</button>
        </div>
      </div>
      <div className="field-preview-content">
        {renderFieldPreviewContent(field)}
      </div>
    </div>
  );
};

export default SortableFormField;