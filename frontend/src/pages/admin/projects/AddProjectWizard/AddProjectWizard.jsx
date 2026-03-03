import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StepProjectForm from './StepProjectForm';
import StepMemberForm from './StepMemberForm';
import StepTaskForm from './StepTaskForm';
import './AddProjectWizard.css';

export default function AddProjectWizard() {
  const navigate = useNavigate();
  const { id } = useParams();        // /new | /:id/edit
  const isEdit = Boolean(id);

  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState(id || null);

  const closeWizard = () => {
    navigate('/admin/projects');
  };

  const handleBack = () => {
    if (step === 1) {
      navigate('/admin/projects');
    } else {
      setStep(prev => prev - 1);
    }
  };


  return (
    <div className="add-project-page">
      <button
        className="wizard-back-btn"
        onClick={handleBack}
      >
        ← Back
      </button>
      {step === 1 && (
        <StepProjectForm
          mode={isEdit ? 'edit' : 'create'}
          projectId={projectId}
          onNext={(id) => {
            setProjectId(id);
            setStep(2);
          }}
          onClose={closeWizard}
          onSuccess={closeWizard}
        />
      )}

      {step === 2 && (
        <StepMemberForm
          projectId={projectId}
          onNext={() => setStep(3)}
          onSkip={closeWizard}
          onClose={closeWizard}
        />
      )}

      {step === 3 && (
        <StepTaskForm
          projectId={projectId}
          onClose={closeWizard}
          onSuccess={closeWizard}
        />
      )}
    </div>
  );
}
