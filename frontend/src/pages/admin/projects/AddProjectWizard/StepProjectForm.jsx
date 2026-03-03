import { useState, useEffect } from 'react';
import { createProject, updateProject } from '../../../../services/project.service';

export default function StepProjectForm({ mode = 'create', initialData, onNext, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    project_type: 'Client Project',
    description: '',
    start_date: '',
    end_date: '',
    price: '',
    labels: '',
  });


  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        name: initialData.name || '',
        project_type: initialData.project_type || 'Client Project',
        description: initialData.description || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        price: initialData.price || '',
        labels: initialData.labels || '',
      });
    }
  }, [mode, initialData]);

  const handleSave = async () => {
    try {
      if (mode === 'edit') {
        await updateProject(initialData.id, form);
      } else {
        await createProject(form);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };


  const handleSaveAndContinue = async () => {
    try {
      const res = await createProject(form);
      onNext?.(res.id);
    } catch (err) {
      console.error(err);
      alert('Create project failed');
    }
  };

  return (
    <div className="wizard-form-container">
      <h3>{mode === 'edit' ? 'Edit Project' : 'Add Project'}</h3>

      {/* Row 1: Title */}
      <div className="form-group">
        <label>Project Title</label>
        <input
          className="form-control"
          placeholder="E.g. Website Redesign"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      {/* Row 2: Type & Price */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label>Project Type</label>
          <select
            className="form-control"
            value={form.project_type}
            onChange={(e) => setForm({ ...form, project_type: e.target.value })}
          >
            <option value="Client Project">Client Project</option>
            <option value="Internal Project">Internal Project</option>
          </select>
        </div>
        <div className="form-group flex-1">
          <label>Price ($)</label>
          <input
            type="number"
            className="form-control"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
      </div>

      {/* Row 3: Description */}
      <div className="form-group">
        <label>Description</label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Briefly describe the project goals..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Row 4: Dates */}
      <div className="form-row">
        <div className="form-group flex-1">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
        </div>
        <div className="form-group flex-1">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </div>
      </div>

      {/* Row 5: Labels */}
      <div className="form-group">
        <label>Labels</label>
        <select
          className="form-control"
          value={form.labels}
          onChange={(e) => setForm({ ...form, labels: e.target.value })}
        >
          <option value="">Select a label</option>
          <option value="High Priority">High Priority</option>
          <option value="Urgent">Urgent</option>
          <option value="On Track">On Track</option>
          <option value="Low Priority">Low Priority</option>
        </select>
      </div>

      {/* Footer Actions */}
      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          Cancel
        </button>

        {/* Luôn hiện nút Save/Update chính */}
        <button className="btn-default" onClick={handleSave}>
          {mode === 'edit' ? 'Update Project' : 'Save & Exit'}
        </button>

        {/* Chỉ hiện nút Next khi tạo mới */}
        {mode === 'create' && (
          <button className="btn-primary" onClick={handleSaveAndContinue}>
            Save & Continue
          </button>
        )}
      </div>
    </div>
  );
}
