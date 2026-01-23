import './EditableRow.css';
const EditableRow = ({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
  options = [],
  error = '',
  placeholder='',
}) => (
  <div className="info-row">
    <div className="info-label">{label}</div>
    <div className="info-value">
      {type === 'select' ? (
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'has-error' : ''}
        >
          <option value="">Select</option>
          {options.map((o, idx) => (
            <option key={o?.id || idx} value={o?.id || o}>
              {o?.name || o}
            </option>
          ))}
        </select>
      ) : type === 'radio' ? (
        <div className="radio-group">
          {options.map((o, idx) => (
            <label key={o?.id || idx} className="radio-label">
              <input
                type="radio"
                name={label}
                value={o?.id || o}
                checked={value === (o?.id || o)}
                onChange={e => onChange(e.target.value)}
                disabled={disabled}
              />
              <span>{o?.name || o}</span>
            </label>
          ))}
          {error && <span className="error-text">{error}</span>}
        </div>
      ) : type === 'checkbox' ? (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!value}
            onChange={e => onChange(e.target.checked)}
            disabled={disabled}
          />
          <span>{value && label === "Disable login" ? value : ""}</span>
          <span>{value && label === "Disable login" ? "⚠️ The user will not be able to login in this system!" : value && label === "Mark as inactive" ? "⚠️ The inactive users will not be able to login in this system and not be counted in the active user list!" : ""}</span>
          {error && <span className="error-text">{error}</span>}
        </label>
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'has-error' : ''}
          placeholder={placeholder}
        />
      )}
      {type !== 'radio' && error && <span className="error-text">{error}</span>}
    </div>
  </div>
);

const EditablePhoneRow = ({ label, children }) => (
  <div className="info-row">
    <div className="info-label">{label}</div>
    <div className="info-value">
      {children}
    </div>
  </div>
);
export { EditablePhoneRow, EditableRow };