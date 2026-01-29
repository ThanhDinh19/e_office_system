import { useState } from 'react';
import StepProjectForm from './StepProjectForm';
import StepMemberForm from './StepMemberForm';
import StepTaskForm from './StepTaskForm';
import './AddProjectWizard.css';

export default function AddProjectWizard({ open, project, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [projectId, setProjectId] = useState(project?.id || null);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {step === 1 && (
          <StepProjectForm
            mode={project ? 'edit' : 'create'}
            initialData={project}
            onNext={(id) => {
              setProjectId(id);
              setStep(2);
            }}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}

        {step === 2 && (
          <StepMemberForm
            projectId={projectId}
            onNext={() => setStep(3)}
            onSkip={() => {
              onSuccess?.();   // reload list project
              onClose();       // đóng wizard
            }}
            onClose={onClose}
          />
        )}


        {step === 3 && (
          <StepTaskForm
            projectId={projectId}
            onClose={onClose}
            onSuccess={onSuccess}
          />
        )}
      </div>
    </div>
  );
}
