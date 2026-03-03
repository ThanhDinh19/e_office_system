import { useState, useEffect } from 'react';
import { getEmployees } from '../../../../services/employee.service';
import { addProjectMembers } from '../../../../services/project.service';

export default function StepMemberForm({ projectId, onNext, onSkip, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [members, setMembers] = useState([{ id: '', role: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEmployees().then(setEmployees);
  }, []);

  const addMember = () => {
    setMembers([...members, { id: '', role: '' }]);
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const saveMembers = async () => {
    setLoading(true);
    try {
      const validMembers = members.filter(m => m.id);
      if (validMembers.length > 0) {
        await addProjectMembers(projectId, validMembers.map(m => m.id));
      }
      onSuccess?.();
      onNext();
    } catch (err) {
      console.error(err);
      alert('Failed to add members');
    } finally {
      setLoading(false);
    }
  };

  // Thay đổi phần return một chút
  return (
    <div className="wizard-form-container">
      <h3>👥 Team Members</h3>

      <div className="form-section">
        <h4>Assign employees to this project</h4>

        {members.map((member, index) => (
          <div key={index} className="member-row">
            <select
              className="form-control" // Dùng chung class form-control đã viết ở step 1
              value={member.id}
              onChange={(e) => updateMember(index, 'id', e.target.value)}
            >
              <option value="">Select member...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} — {emp.position || 'Staff'}
                </option>
              ))}
            </select>

            {members.length > 1 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeMember(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="add-more-btn"
          onClick={addMember}
        >
          + Add Another Member
        </button>
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn-skip" onClick={onSkip}>Skip for now</button>
        <button
          className="btn-primary"
          onClick={saveMembers}
          disabled={loading || members.every(m => !m.id)}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </div>
  );
}