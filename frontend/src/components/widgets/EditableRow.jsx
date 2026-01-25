import './EditableRow.css';
import { AddressPicker } from '../widgets/AddressPicker';

const EditableRow = ({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
  options = [],
  error = '',
  placeholder = '',
}) => (
  <div className="info-row">
    <div className="info-label">{label}</div>

    <div className="info-value">
      {/* ADDRESS */}
      {type === 'address' && (
        <AddressPicker
          value={value}
          onChange={onChange}
        />
      )}

      {/* SELECT */}
      {type === 'select' && (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'has-error' : ''}
        >
          <option value="">Select</option>
          {options.map((o, idx) => (
            <option
              key={o?.id || idx}
              value={o?.id || o}
            >
              {o?.name || o}
            </option>
          ))}
        </select>
      )}

      {/* TEXTAREA */}
      {type === 'textarea' && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'has-error' : ''}
          placeholder={placeholder}
          rows={4}
        />
      )}

      {/* RADIO */}
      {type === 'radio' && (
        <div className="radio-group">
          {options.map((o, idx) => (
            <label key={idx} className="radio-label">
              <input
                type="radio"
                value={o}
                checked={value === o}
                onChange={(e) => onChange(e.target.value)}
              />
              <span>{o}</span>
            </label>
          ))}
        </div>
      )}

      {/* CHECKBOX */}
      {type === 'checkbox' && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
          />

          {value && label === 'Disable login' && (
            <span>
              ⚠️ The user will not be able to login in this system!
            </span>
          )}

          {value && label === 'Mark as inactive' && (
            <span>
              ⚠️ The inactive users will not be able to login in this system
              and not be counted in the active user list!
            </span>
          )}

          {error && <span className="error-text">{error}</span>}
        </label>
      )}

      {/* DEFAULT INPUT */}
      {!['address', 'select', 'textarea', 'radio', 'checkbox'].includes(type) && (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'has-error' : ''}
          placeholder={placeholder}
        />
      )}

      {error && <span className="error-text">{error}</span>}
    </div>
  </div>
);

const EditablePhoneRow = ({ label, children }) => (
  <div className="info-row">
    <div className="info-label">{label}</div>
    <div className="info-value">{children}</div>
  </div>
);

export { EditableRow, EditablePhoneRow };
