import './ConfirmModal.css';

export default function ConfirmModal({
  open,
  title = 'Xác nhận',
  message,
  onConfirm,
  onCancel,
  labelLeft = 'Cancel',
  labelRight = 'Yes',
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-icon">⚠️</span>
          <h3>{title}</h3>
        </div>

        <p className="modal-message">{message}</p>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onCancel}>
            {labelLeft}
          </button>
          <button className="btn delete" onClick={onConfirm}>
            {labelRight}
          </button>
        </div>
      </div>
    </div>
  );
}
