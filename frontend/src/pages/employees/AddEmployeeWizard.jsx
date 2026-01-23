import { useState, useEffect } from 'react';
import './AddEmployeeWizard.css';
import { getRoles } from '../../services/role.service';
import { getDepartments } from '../../services/department.service';
import { createEmployee } from '../../services/employee.service';
import { getPositions } from '../../services/position.service';
import { useNotification } from '../../context/NotificationContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getUsers } from "../../services/adminUser.service";



export default function AddEmployeeWizard({ open, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const { showNotification } = useNotification();
  const [users, setUser] = useState([]);
  const [formData, setFormData] = useState({
    fullname: '',
    cccd: '',
    address: '',
    phone: '',
    dob: '',
    gender: '',
    department_id: '',
    position_id: '',
    jobTitle: '',
    salary: '',
    salaryTerm: '',
    hireDate: '',
    endDate: '',
    username: '',
    email: '',
    password: '',
    role_id: '',
    sendEmail: false,
  });
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (!open) return;

    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error(err);
      }
    }

    const fetchPositions = async () => {
      try {
        const data = await getPositions();
        setPositions(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchPositions();
    fetchDepartments();
    fetchRoles();
  }, [open]);

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullname.trim()) newErrors.fullname = 'Required';
      if (!formData.cccd.trim()) newErrors.cccd = 'Required';
      if (!formData.phone.trim()) newErrors.phone = 'Required';
      if (!formData.phone || formData.phone.length < 10) {
        newErrors.phone = 'Invalid phone number';
      }
      if (!formData.gender) newErrors.gender = 'Required';
    }

    if (step === 2) {
      if (!formData.department_id.trim()) newErrors.department_id = 'Required';
      if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Required';
      if (!formData.salary.trim()) newErrors.salary = 'Required';
      if (!formData.hireDate) newErrors.hireDate = 'Required';

      if (formData.endDate && formData.hireDate) {
        const start = new Date(formData.hireDate);
        const end = new Date(formData.endDate);

        if (end < start) {
          newErrors.endDate = 'Contract end date must be after hire date';
        }
      }
    }

    if (step === 3) {
      if (!formData.username.trim()) newErrors.username = 'Required';

      users.forEach(u => {
        if (u.username === formData.username) {
          newErrors.username = 'Username already exists';
        }
      });

      users.forEach(u => {
        if (u.email === formData.email) {
          newErrors.email = 'Email already exists';
        }
      });

      if (!formData.email.trim()) newErrors.email = 'Required';
      if (!formData.password.trim()) newErrors.password = 'Required';
      if (!formData.role_id) newErrors.role_id = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      fullname: '',
      cccd: '',
      address: '',
      phone: '',
      gender: '',
      department_id: '',
      jobTitle: '',
      salary: '',
      salaryTerm: '',
      hireDate: '',
      endDate: '',
      username: '',
      email: '',
      password: '',
      role_id: '',
      sendEmail: false,
    });
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateStep()) return;

    try {
      const payload = {
        fullname: formData.fullname,
        cccd: formData.cccd,
        address: formData.address,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        department_id: formData.department_id,
        position_id: formData.position_id,
        jobTitle: formData.jobTitle,
        hireDate: formData.hireDate,
        endDate: formData.endDate,

        salary: formData.salary,
        salaryTerm: formData.salaryTerm,

        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id,
        sendEmail: formData.sendEmail,
      };

      console.log('Submitting payload:', payload);
      await createEmployee(payload);
      showNotification('Employee created successfully', 'success');
      resetForm();        // clear wizard
      onSuccess?.();      // reload user list
      onClose();
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || 'Error creating employee',
        'error'
      );
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="wizard-overlay">
      <div className="wizard-modal">
        {/* ===== Header ===== */}
        <div className="wizard-header">
          <h3>Add member</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* ===== Steps ===== */}
        <div className="wizard-steps">
          <Step label="General Info" active={step >= 1} />
          <Step label="Job Info" active={step >= 2} />
          <Step label="Account settings" active={step >= 3} />
        </div>

        {/* ===== Content ===== */}
        <div className="wizard-content">
          {step === 1 && <GeneralInfo data={formData} update={updateField} errors={errors} />}
          {step === 2 && <JobInfo data={formData} update={updateField} errors={errors} departments={departments} positions={positions} />}
          {step === 3 && <AccountSettings data={formData} update={updateField} errors={errors} roles={roles} />}
        </div>

        {/* ===== Footer ===== */}
        <div className="wizard-footer">
          <button onClick={onClose}>Close</button>

          {step > 1 && (
            <button onClick={() => setStep(step - 1)}>Previous</button>
          )}

          {step < 3 ? (
            <button className="primary" onClick={handleNext}>
              Next
            </button>
          ) : (
            <button className="primary" onClick={handleSave}>Save</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

const Step = ({ label, active }) => (
  <div className={`wizard-step ${active ? 'active' : ''}`}>
    <span className="dot" />
    {label}
  </div>
);

/* ===== Step 1 ===== */
const GeneralInfo = ({ data, update, errors }) => (
  <>
    <Field
      label="Full name"
      value={data.fullname}
      onChange={v => update('fullname', v)}
      error={errors.fullname}
    />

    <Field
      label="Citizen identification number"
      value={data.cccd}
      onChange={v => update('cccd', v)}
      error={errors.cccd}
    />

    <Field
      label="Mailing address"
      textarea
      value={data.address}
      onChange={v => update('address', v)}
    />

    <div className="form-field">
      <label>
        Phone <span className="required">*</span>
      </label>

      <PhoneInput
        country={'vn'}          // mặc định Việt Nam
        value={data.phone}
        onChange={(value) => update('phone', value)}
        inputStyle={{
          width: '100%',
          height: '38px',
        }}
      />

      {errors.phone && <span className="error-text">{errors.phone}</span>}
    </div>


    <Field
      label="Date of birth"
      type="date"
      value={data.dob}
      onChange={v => update('dob', v)}
      error={errors.dob}
    />

    <RadioGroup
      label="Gender"
      options={['Male', 'Female', 'Other']}
      value={data.gender}
      onChange={v => update('gender', v)}
      error={errors.gender}
    />
  </>
);

const SelectDepartment = ({ label, value, onChange, options, error }) => {
  return (
    <div className="form-field">
      <label>
        {label}
        {label === 'Department' && <span className="required">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select role --</option>

        {options.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

const SelectPosition = ({ label, value, onChange, options, error }) => {
  return (
    <div className="form-field">
      <label>
        {label}
        {label === 'Position' && <span className="required">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select role --</option>

        {options.map((position) => (
          <option key={position.id} value={position.id}>
            {position.name}
          </option>
        ))}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

/* ===== Step 2 ===== */
const JobInfo = ({ data, update, errors, departments, positions }) => (
  <>
    <SelectDepartment
      label="Department"
      value={data.department_id}
      onChange={v => update('department_id', v)}
      options={departments}
      error={errors.department_id}
    />

    <SelectPosition
      label="Position"
      value={data.position_id}
      onChange={v => update('position_id', v)}
      options={positions}
      error={errors.position_id}
    />

    <Field
      label="Job Title"
      value={data.jobTitle}
      onChange={v => update('jobTitle', v)}
      error={errors.jobTitle}
    />

    <Field
      type="number"
      label="Salary"
      value={data.salary}
      onChange={v => update('salary', v)}
      error={errors.salary}
    />

    <Field
      label="Salary term"
      value={data.salaryTerm}
      onChange={v => update('salaryTerm', v)}
    />

    <Field
      label="Date of hire"
      type="date"
      value={data.hireDate}
      onChange={v => update('hireDate', v)}
      error={errors.hireDate}
    />

    <Field
      label="Contract end date"
      type="date"
      value={data.endDate}
      onChange={v => update('endDate', v)}
      error={errors.endDate}
      min={data.hireDate}
    />
  </>
);

/* ===== Step 3 ===== */



const SelectRole = ({ label, value, onChange, options, error, }) => {
  const selectedRole = options.find(r => String(r.id) === String(value));

  return (
    <div className="form-field">
      <label>
        {label}
        {label === 'Role' && <span className="required">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select role --</option>

        {options.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      {/* CẢNH BÁO KHI CHỌN ADMIN */}
      {selectedRole?.name === 'ADMIN' && (
        <div className="warning-text">
          ⚠️ Admin has full access to view and modify all data in the system.
        </div>
      )}

      {error && <span className="error-text">{error}</span>}
    </div>
  );
};


const AccountSettings = ({ data, update, errors, roles }) => (
  <>

    <Field
      label="Username"
      type="text"
      value={data.username}
      onChange={v => update('username', v)}
      error={errors.username}
    />

    <Field
      label="Email"
      type="email"
      value={data.email}
      onChange={v => update('email', v)}
      error={errors.email}
    />

    <Field
      label="Password"
      type="password"
      value={data.password}
      onChange={v => update('password', v)}
      error={errors.password}
    />

    <SelectRole
      label="Role"
      value={data.role_id}
      onChange={v => update('role_id', v)}
      options={roles}
      error={errors.role_id}
    />

    <Checkbox
      label="Email login details to this user"
      checked={data.sendEmail}
      onChange={v => update('sendEmail', v)}
    />
  </>
);




/* ================= FORM ATOMS ================= */

const Field = ({ label, type = 'text', textarea, value, onChange, error, ...props }) => (
  <div className="form-field">
    <label>
      {label}
      {(label === 'Full name' || label === 'Phone' ||
        label === 'Gender' || label === 'Job Title' || label === 'Salary' ||
        label === 'Date of hire' || label === 'Email' || label === 'Password') && <span className="required">*</span>}
    </label>

    {textarea ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={label}
        {...props}
      />
    )}

    {error && <span className="error-text">{error}</span>}
  </div>
);

const RadioGroup = ({ label, options, value, onChange, error }) => (
  <div className="form-field">
    <label>
      {label}
      <span className="required">*</span>
    </label>
    <div className="radio-group">
      {options.map((o) => (
        <label key={o}>
          <input
            type="radio"
            name={label}
            value={o}
            checked={value === o}
            onChange={e => onChange(e.target.value)}
          />
          {o}
        </label>
      ))}
    </div>
    {error && <span className="error-text">{error}</span>}
  </div>
);



const Checkbox = ({ label, checked, onChange }) => (
  <label className="checkbox">
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    {label}
  </label>
);
