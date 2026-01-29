import { useEffect, useState } from 'react';
import './AddProjectForm.css';
import { createProject } from '../../../services/project.service';
import { getEmployees } from '../../../services/employee.service';

export default function AddProjectForm({ open, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    project_type: 'Internal Project',
    description: '',
    manager_id: '',
    start_date: '',
    end_date: '',
    price: '',
    labels: 'On Track',
    member_ids: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  /* ================= HELPERS ================= */

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      member_ids: prev.member_ids.includes(id)
        ? prev.member_ids.filter((m) => m !== id)
        : [...prev.member_ids, id],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.manager_id) newErrors.manager_id = 'Manager is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await createProject({
        ...formData,
        price: formData.price ? Number(formData.price) : null,
      });

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Create project failed');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="apf-overlay">
      <div className="apf-modal">
        <div className="apf-header">
          <h3>Add project</h3>
          <button className="apf-close" onClick={onClose}>×</button>
        </div>

        <div className="apf-body">
          {/* Project name */}
          <div className="apf-field">
            <label>Project name *</label>
            <input
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* Project type */}
          <div className="apf-field">
            <label>Project type</label>
            <select
              value={formData.project_type}
              onChange={(e) => updateField('project_type', e.target.value)}
            >
              <option value="Internal Project">Internal Project</option>
              <option value="Client Project">Client Project</option>
            </select>
          </div>

          {/* Description */}
          <div className="apf-field">
            <label>Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {/* Manager */}
          <div className="apf-field">
            <label>Project manager *</label>
            <select
              value={formData.manager_id}
              onChange={(e) => updateField('manager_id', e.target.value)}
            >
              <option value="">-- Select manager --</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.full_name}
                </option>
              ))}
            </select>
            {errors.manager_id && <span className="error">{errors.manager_id}</span>}
          </div>

          {/* Dates */}
          <div className="apf-row">
            <div className="apf-field">
              <label>Start date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
              />
              {errors.start_date && <span className="error">{errors.start_date}</span>}
            </div>

            <div className="apf-field">
              <label>End date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => updateField('end_date', e.target.value)}
              />
            </div>
          </div>

          {/* Price */}
          <div className="apf-field">
            <label>Price</label>
            <input
              type="number"
              placeholder="Optional"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
          </div>

          {/* Labels */}
          <div className="apf-field">
            <label>Label</label>
            <select
              value={formData.labels}
              onChange={(e) => updateField('labels', e.target.value)}
            >
              <option value="High Priority">High Priority</option>
              <option value="On Track">On Track</option>
              <option value="Perfect">Perfect</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Members */}
          <div className="apf-field">
            <label>Project members</label>
            <div className="apf-members">
              {employees.map((e) => (
                <label key={e.id} className="apf-member">
                  <input
                    type="checkbox"
                    checked={formData.member_ids.includes(e.id)}
                    onChange={() => toggleMember(e.id)}
                  />
                  {e.full_name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="apf-footer">
          <button className="btn outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Create project'}
          </button>
        </div>
      </div>
    </div>
  );
}
