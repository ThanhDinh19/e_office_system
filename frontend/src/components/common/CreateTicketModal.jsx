
import './CreateTicketModal.css';

export default function CreateTicketModal({ open, loading, services = [], onClose, onSubmit, }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-ticket">
        <div className="modal-header-ticket">
          <h3>Create Ticket</h3>
          <button className="btn-close" onClick={onClose}>X</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (loading) return;

            const formData = new FormData(e.target);

            onSubmit(formData); // gửi thẳng FormData để upload file
          }}
        >
          {/* SERVICE */}
          {/* <div className="form-group">
            <label>Service</label>
            <select name="service_id" required>
              <option value="">-- Select service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* CATEGORY / SUBJECT */}
          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              placeholder="e.g. Login issue, Network, Email..."
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe your issue in detail..."
              required
            />
          </div>

          {/* ATTACHMENTS */}
          <div className="form-group">
            <label>Attachments</label>
            <input
              type="file"
              name="attachments"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>

          {/* PRIORITY (OPTIONAL – SAFE VERSION) */}
          <div className="form-group">
            <label>Priority</label>
            <select name="priority_id" defaultValue={3}>
              <option value={3}>Medium</option>
              <option value={4}>Low</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
