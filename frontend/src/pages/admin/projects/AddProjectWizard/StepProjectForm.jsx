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
    <>
      <h3>Add project</h3>

      <input
        placeholder="Title"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <select
        value={form.project_type}
        onChange={(e) => setForm({ ...form, project_type: e.target.value })}
      >
        <option value="Client Project">Client Project</option>
        <option value="Internal Project">Internal Project</option>
      </select>

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="date"
        value={form.start_date}
        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
      />

      <input
        type="date"
        value={form.end_date}
        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
      />

      <input
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <select
        value={form.labels}
        onChange={(e) => setForm({ ...form, labels: e.target.value })}
      >
        <option value="">Labels</option>
        <option value="High Priority">High Priority</option>
        <option value="Urgent">Urgent</option>
        <option value="On Track">On Track</option>
      </select>

      <div className="modal-actions">
        <button onClick={onClose}>Cancel</button>

        <button onClick={handleSave}>
          {mode === 'edit' ? 'Update' : 'Save'}
        </button>

        {mode === 'create' && (
          <button className="primary" onClick={handleSaveAndContinue}>
            Save & continue
          </button>
        )}
      </div>
    </>
  );
}
