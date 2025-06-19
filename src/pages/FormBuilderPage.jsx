// src/pages/FormBuilderPage.jsx
// src/pages/FormBuilderPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

// React Icons Imports
import {
  FiType, FiMail, FiPhone, FiHash, FiAlignLeft, FiDisc, FiCheckSquare,
  FiMove, FiEdit3, FiTrash2, FiCalendar, FiChevronDown, FiClock, // <-- Added FiClock
} from 'react-icons/fi';

import SortableFormField from '../components/SortableFormField';
import Footer from '../components/common/Footer'; // Corrected path confirmed!
import '../styles/FormBuilderPage.css'; // Make sure this CSS file is up-to-date with DND styles

// --- Define the available input types and their default settings ---
const INPUT_TYPES = [
  { id: 'text', label: 'Text Input', icon: <FiType />, default: { label: 'Text Field', placeholder: 'Enter text', required: false, minLength: 0, maxLength: 255 } },
  { id: 'email', label: 'Email Input', icon: <FiMail />, default: { label: 'Email', placeholder: 'Enter email', required: false } },
  { id: 'phone', label: 'Phone Number', icon: <FiPhone />, default: { label: 'Phone', placeholder: 'Enter phone number', required: false, minLength: 10, maxLength: 15 } },
  { id: 'number', label: 'Number Input', icon: <FiHash />, default: { label: 'Quantity', placeholder: 'Enter a number', required: false, min: 0, max: 999 } },
  { id: 'textarea', label: 'Paragraph', icon: <FiAlignLeft />, default: { label: 'Description', placeholder: 'Enter long text', required: false, minLength: 0, maxLength: 500 } },
  { id: 'radio', label: 'Multiple Choice', icon: <FiDisc />, default: { label: 'Options', required: false, options: ['Option 1', 'Option 2'] } },
  { id: 'checkbox', label: 'Checkboxes', icon: <FiCheckSquare />, default: { label: 'Check all that apply', required: false, options: ['Option A', 'Option B'] } }, // Added options for checkboxes
  { id: 'select', label: 'Dropdown', icon: <FiChevronDown />, default: { label: 'Choose an option', required: false, options: ['Option X', 'Option Y'] } }, // New: Dropdown
  { id: 'date', label: 'Date', icon: <FiCalendar />, default: { label: 'Date', required: false } }, // New: Date Picker
  { id: 'time', label: 'Time', icon: <FiClock />, default: { label: 'Time', required: false } }, // New: Time Picker
];

// ... (rest of the FormBuilderPage.jsx code)
// --- Draggable Field Type Component (for left sidebar) ---
function DraggableFieldType({ type, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-field-type-${type.id}`, // Unique ID for draggable item
    data: {
      typeId: type.id, // Pass the type ID as data
      isFieldType: true, // Flag to identify this as a new field type drag
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    cursor: 'grabbing',
    zIndex: 200, // Ensure dragged item is on top
    opacity: 0.8,
    border: '1px dashed var(--color-primary)',
    backgroundColor: 'var(--color-white)',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: 'var(--shadow-md)',
  } : {};

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="field-type-item draggable-field-item"
      onClick={onClick} // Keep the click handler for non-drag adds
    >
      <span className="type-icon">{type.icon}</span>
      {type.label}
    </button>
  );
}

// --- Sortable Form Field Component (from previous step, but included here for completeness) ---
// This component should ideally be in its own file: src/components/SortableFormField.jsx
// For the sake of providing a complete FormBuilderPage.jsx, its essence is shown below.
// Make sure your actual SortableFormField.jsx matches this.
// --- START of SortableFormField essence ---
/*
// src/components/SortableFormField.jsx content if you've been following along:
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { FiMove, FiEdit3, FiTrash2 } from 'react-icons/fi'; // Icons for actions

const SortableFormField = ({ field, index, onEdit, onRemove, isEditing }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    border: isDragging ? '2px dashed var(--color-primary)' : '',
    boxShadow: isDragging ? '0 0 0 4px rgba(0, 123, 255, 0.2)' : '',
    zIndex: isDragging ? 100 : 'auto',
  };

  const renderFieldPreviewContent = (field) => {
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
            <span>{field.label}</span>
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
      onClick={() => onEdit(index)}
    >
      <div className="field-preview-header">
        <span>{field.label} {field.required && '*'}</span>
        <div className="field-actions">
          <button
            className="icon-btn drag-handle"
            {...listeners}
            title="Drag to reorder"
          >
            <FiMove />
          </button>
          <button className="icon-btn edit-btn" onClick={(e) => { e.stopPropagation(); onEdit(index); }} title="Edit field">
            <FiEdit3 />
          </button>
          <button className="icon-btn delete-btn" onClick={(e) => { e.stopPropagation(); onRemove(index); }} title="Delete field">
            <FiTrash2 />
          </button>
        </div>
      </div>
      <div className="field-preview-content">
        {renderFieldPreviewContent(field)}
      </div>
    </div>
  );
};

export default SortableFormField;
*/
// --- END of SortableFormField essence ---

// --- Main FormBuilderPage Component ---
const FormBuilderPage = () => {
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
  const [formFields, setFormFields] = useState([]); // Array to store configured form fields
  const [selectedFieldType, setSelectedFieldType] = useState(null); // Type selected from left dashboard
  const [currentFieldSettings, setCurrentFieldSettings] = useState({}); // Settings for the field being configured
  const [editingFieldIndex, setEditingFieldIndex] = useState(null); // Index of field being edited in canvas

  const [isDraggingNewField, setIsDraggingNewField] = useState(false); // New state for dragging status

  // --- DND-KIT Sensors ---
  const sensors = useSensors(
    // Added activationConstraint to PointerSensor to prevent accidental drags on clicks
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- DND-KIT: handleDragStart for visual feedback ---
  function handleDragStart(event) {
    if (event.active.data.current?.isFieldType) {
      setIsDraggingNewField(true);
    }
  }

  // --- DND-KIT: handleDragEnd for adding field or reordering ---
  function handleDragEnd(event) {
    setIsDraggingNewField(false); // Reset dragging state regardless of drop outcome

    const { active, over } = event;

    // Case 1: Dragging an existing field to reorder (its ID starts with 'field-')
    if (active.data.current?.id && String(active.data.current.id).startsWith('field-') && over && over.id !== active.id) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    // Case 2: Dragging a new field type from the sidebar to the canvas
    else if (active.data.current?.isFieldType && over?.id === 'form-drop-area') {
      const typeId = active.data.current.typeId;
      const type = INPUT_TYPES.find(t => t.id === typeId);

      if (type) {
        // Automatically add the field with default settings
        const newField = {
          ...type.default,
          type: typeId,
          // Generate a more robust unique name for the field in the schema
          name: `${typeId}-${Math.random().toString(36).substr(2, 6)}`,
          id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID for DND
        };
        setFormFields(prev => {
          const updatedFields = [...prev, newField];
          // After adding, immediately select it for editing
          setEditingFieldIndex(updatedFields.length - 1);
          setCurrentFieldSettings(newField);
          setSelectedFieldType(type);
          return updatedFields;
        });
      }
    }
  }
  // --- END DND-KIT ---

  // --- Droppable hook for the canvas ---
  const { setNodeRef: setDropNodeRef, isOver } = useDroppable({
    id: 'form-drop-area', // Unique ID for the droppable area
  });

  // Handler for selecting an input type from the left sidebar (click)
  const handleSelectFieldType = (typeId) => {
    const type = INPUT_TYPES.find(t => t.id === typeId);
    setSelectedFieldType(type);
    setCurrentFieldSettings({
      ...type.default,
      type: typeId,
      name: `${typeId}-${formFields.length + 1}-${Date.now().toString().slice(-4)}`
    }); // Initialize settings
    setEditingFieldIndex(null); // Not editing an existing field yet
  };

  // Handler for changing settings in the right sidebar
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentFieldSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handler for adding/updating options for radio/checkbox groups
  const handleOptionsChange = (e, index) => {
    const newOptions = [...currentFieldSettings.options];
    newOptions[index] = e.target.value;
    setCurrentFieldSettings(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCurrentFieldSettings(prev => ({
      ...prev,
      options: [...(prev.options || []), 'New Option']
    }));
  };

  const removeOption = (indexToRemove) => {
    setCurrentFieldSettings(prev => ({
      ...prev,
      options: prev.options.filter((_, index) => index !== indexToRemove)
    }));
  };


  // Handler for adding a configured field to the center canvas (after clicking "Add Field" button)
  const handleAddField = () => {
    if (!currentFieldSettings.label || (currentFieldSettings.type === 'radio' && currentFieldSettings.options.some(opt => !opt))) {
      alert("Please fill in all required field settings!");
      return;
    }

    if (editingFieldIndex !== null) {
      // Update existing field
      const updatedFields = formFields.map((field, index) =>
        index === editingFieldIndex ? currentFieldSettings : field
      );
      setFormFields(updatedFields);
      setEditingFieldIndex(null);
    } else {
      // Add new field - IMPORTANT: Add a unique 'id' for dnd-kit
      setFormFields(prev => [...prev, { ...currentFieldSettings, id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }]);
    }
    // Reset selection and settings
    setSelectedFieldType(null);
    setCurrentFieldSettings({});
  };

  // Handler for editing an existing field on the canvas
  const handleEditField = (index) => {
    setEditingFieldIndex(index);
    setCurrentFieldSettings({ ...formFields[index] });
    setSelectedFieldType(INPUT_TYPES.find(t => t.id === formFields[index].type));
  };

  // Handler for removing a field from the canvas
  const handleRemoveField = (indexToRemove) => {
    setFormFields(prev => prev.filter((_, index) => index !== indexToRemove));
    if (editingFieldIndex === indexToRemove) {
      setSelectedFieldType(null);
      setCurrentFieldSettings({});
      setEditingFieldIndex(null);
    }
  };

  // // src/pages/FormBuilderPage.jsx (inside the FormBuilderPage component)

// ... (other code above renderFieldSettings)

  // Function to render field settings based on selected type
  const renderFieldSettings = () => {
    if (!selectedFieldType) {
      return <p className="select-field-prompt">Select a field type from the left or drag one to configure it.</p>;
    }

    const commonSettings = (
      <>
        <label>Label:*
          <input
            type="text"
            name="label"
            value={currentFieldSettings.label || ''}
            onChange={handleSettingChange}
            required
          />
        </label>
        <label>Name (for JSON):
          <input
            type="text"
            name="name"
            value={currentFieldSettings.name || ''}
            onChange={handleSettingChange}
            placeholder="Unique field name (e.g., firstName)"
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="required"
            checked={currentFieldSettings.required || false}
            onChange={handleSettingChange}
          />
          Required
        </label>
      </>
    );

    const specificSettings = (type) => {
      switch (type.id) {
        case 'text':
        case 'email':
        case 'phone':
        case 'textarea': // Now 'Paragraph'
          return (
            <>
              <label>Placeholder:
                <input
                  type="text"
                  name="placeholder"
                  value={currentFieldSettings.placeholder || ''}
                  onChange={handleSettingChange}
                />
              </label>
              <label>Min Length:
                <input
                  type="number"
                  name="minLength"
                  value={currentFieldSettings.minLength || 0}
                  onChange={handleSettingChange}
                />
              </label>
              <label>Max Length:
                <input
                  type="number"
                  name="maxLength"
                  value={currentFieldSettings.maxLength || 255}
                  onChange={handleSettingChange}
                />
              </label>
            </>
          );
        case 'number':
          return (
            <>
              <label>Placeholder:
                <input
                  type="text"
                  name="placeholder"
                  value={currentFieldSettings.placeholder || ''}
                  onChange={handleSettingChange}
                />
              </label>
              <label>Min Value:
                <input
                  type="number"
                  name="min"
                  value={currentFieldSettings.min || 0}
                  onChange={handleSettingChange}
                />
              </label>
              <label>Max Value:
                <input
                  type="number"
                  name="max"
                  value={currentFieldSettings.max || 999}
                  onChange={handleSettingChange}
                />
              </label>
            </>
          );
        case 'radio':
        case 'checkbox': // <-- Added checkbox here
        case 'select': // <-- Added select here
          return (
            <div className="options-group">
              <label>Options:</label>
              {(currentFieldSettings.options || []).map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionsChange(e, index)}
                  />
                  <button type="button" onClick={() => removeOption(index)} className="remove-option-btn">
                    &times;
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="add-option-btn">
                + Add Option
              </button>
            </div>
          );
        case 'date':
        case 'time':
          return null; // No specific settings other than common for now
        default:
          return null;
      }
    };

    // ... (rest of the renderFieldSettings function and FormBuilderPage component)
    return (
      <div className="field-settings-form">
        <h4>{editingFieldIndex !== null ? `Editing ${selectedFieldType.label}` : `Configure ${selectedFieldType.label}`}</h4>
        {commonSettings}
        {specificSettings(selectedFieldType)}
        {/* Only show 'Add Field' button if a field type is selected and not currently editing by drag-drop */}
        {selectedFieldType && (
          <button className="btn primary" onClick={handleAddField}>
            {editingFieldIndex !== null ? 'Update Field' : 'Add Field to Form'}
          </button>
        )}
        {editingFieldIndex !== null && (
          <button className="btn secondary" onClick={() => {
            setSelectedFieldType(null);
            setCurrentFieldSettings({});
            setEditingFieldIndex(null);
          }}>
            Cancel Edit
          </button>
        )}
      </div>
    );
  };

  // Function to build the final JSON schema
  const buildFormSchema = () => {
    return {
      formTitle: formTitle,
      formDescription: formDescription,
      fields: formFields.map(field => {
        const { id, ...rest } = field; // Remove internal 'id' before exporting
        return rest; // Return only the properties relevant to the form schema
      })
    };
  };

  // Navigate to the built form display page, passing the schema
  const handleBuildForm = () => {
    if (formFields.length === 0) {
      alert("Please add at least one field to your form!");
      return;
    }
    const formSchema = buildFormSchema();
    localStorage.setItem('builtFormSchema', JSON.stringify(formSchema));
    navigate('/built-form');
  };

  return (
    <div className="form-builder-page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        &larr; Back to Home
      </button>

      <h2 className="builder-title">Customize Your Own Form</h2>

      <div className="form-builder-layout">
        {/* Left Sidebar: Input Type Dashboard */}
        <aside className="builder-sidebar left-sidebar">
          <h3>Field Types</h3>
          <div className="field-types-list">
            {INPUT_TYPES.map(type => (
              <DraggableFieldType
                key={type.id}
                type={type}
                onClick={() => handleSelectFieldType(type.id)} // Keep click functionality
              />
            ))}
          </div>
        </aside>

        {/* Center Canvas: Form Preview Area */}
        <main className="builder-canvas">
          <div className="canvas-header">
            <input
              type="text"
              className="form-main-title-input"
              placeholder="Form Title (e.g., Job Application Form)"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <textarea
              className="form-description-input"
              placeholder="Form Description (optional)"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            ></textarea>
          </div>

          <div
            ref={setDropNodeRef} // Attach droppable ref to this div
            className={`form-preview-area ${isOver && isDraggingNewField ? 'drag-over' : ''}`}
          >
            {formFields.length === 0 ? (
              <p className="empty-canvas-prompt">
                {isOver && isDraggingNewField ? "Drop here to add field" : "Add fields from the left sidebar or drag and drop to start building your form."}
              </p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={formFields.map(field => field.id)} // Provide unique IDs for sortable context
                  strategy={verticalListSortingStrategy}
                >
                  {formFields.map((field, index) => (
                    <SortableFormField
                      key={field.id} // Important: use field.id as key
                      field={field}
                      index={index}
                      onEdit={handleEditField}
                      onRemove={handleRemoveField}
                      isEditing={editingFieldIndex === index}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </main>

        {/* Right Sidebar: Field Settings */}
        <aside className="builder-sidebar right-sidebar">
          <h3>Field Settings</h3>
          {renderFieldSettings()}
        </aside>
      </div>

      <div className="build-form-actions">
        <button className="btn primary" onClick={handleBuildForm}>Build Form</button>
      </div>

      <Footer />
    </div>
  );
};

export default FormBuilderPage;