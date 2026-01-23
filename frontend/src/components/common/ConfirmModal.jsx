import './ConfirmModal.css';

export default function ConfirmModal({
  open,
  title = 'Xác nhận',
  message,
  onConfirm,
  onCancel,
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
            Huỷ
          </button>
          <button className="btn delete" onClick={onConfirm}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
