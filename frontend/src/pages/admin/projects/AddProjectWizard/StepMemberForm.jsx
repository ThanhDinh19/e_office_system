import { useState, useEffect } from 'react';
import { getEmployees } from '../../../../services/employee.service';
import { addProjectMembers } from '../../../../services/project.service';

export default function StepMemberForm({ projectId, onNext, onSkip, onClose }) {
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
      onNext();
    } catch (err) {
      console.error(err);
      alert('Failed to add members');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3>👥 Add Team Members</h3>

      <div className="form-section">
        <h4>Select Project Members</h4>
        
        {members.map((member, index) => (
          <div key={index} className="member-row">
            <select
              value={member.id}
              onChange={(e) => updateMember(index, 'id', e.target.value)}
            >
              <option value="">Select member</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name} - {emp.position || 'Staff'}
                </option>
              ))}
            </select>

            {members.length > 1 && (
              <button 
                type="button"
                onClick={() => removeMember(index)}
                title="Remove member"
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
          Add another member
        </button>
      </div>

      <div className="modal-actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={onSkip}>Skip this step</button>
        <button 
          className="primary" 
          onClick={saveMembers}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </>
  );
}