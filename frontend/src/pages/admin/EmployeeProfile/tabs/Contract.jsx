import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEmployeeById, updateContract } from '../../../../services/employee.service';
import { EditableRow, EditablePhoneRow } from '../../../../components/widgets/EditableRow';
import { useNotification } from '../../../../context/NotificationContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './Contract.css';
import { getDepartments } from '../../../../services/department.service';
import { getPositions } from '../../../../services/position.service';
import { exportContract } from '../../../../services/adminUser.service';


export default function Contract() {
    const { id } = useParams();
    const { showNotification } = useNotification();
    const [employee, setEmployee] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('contract');
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);


    useEffect(() => {
        const fetchEmployee = async () => {
            if (id) {
                const emp = await getEmployeeById(id);
                setEmployee(emp);
                const contract = emp?.EmployeeContracts?.[0] || {};
                const user = emp?.User || {};

                setFormData({
                    /* ===== BASIC ===== */
                    id: id,
                    employee_code: emp?.employee_code || '',
                    full_name: emp?.full_name || '',
                    avatar: emp?.avatar || '',

                    /* ===== PERSONAL ===== */
                    dob: emp?.dob || '',
                    gender: emp?.gender || '',
                    place_of_birth: emp?.place_of_birth || '',
                    nationality: emp?.nationality || '',

                    /* ===== CONTACT ===== */
                    phone: emp?.phone || '',
                    email: emp?.email || '',
                    address: emp?.address || '',
                    permanent_address: emp?.permanent_address,

                    /* ===== LEGAL ===== */
                    cccd: emp?.cccd || '',
                    cccd_issue_date: emp?.cccd_issue_date || '',
                    cccd_issue_place: emp?.cccd_issue_place || '',
                    labor_book_number: emp?.labor_book_number || '',
                    labor_book_issue_date: emp?.labor_book_issue_date || '',
                    labor_book_issue_place: emp?.labor_book_issue_place || '',
                    profession: emp?.profession || '',

                    /* ===== JOB ===== */
                    department_id: emp.Department?.id || '',
                    position_id: emp.Position?.id || '',
                    join_date: emp?.join_date || '',

                    /* ===== CONTRACT ===== */
                    contract_id: contract?.id || '',
                    contract_type: contract?.contract_type || '',
                    contract_number: contract?.contract_number || '',
                    start_date: contract?.start_date || '',
                    end_date: contract?.end_date || '',
                    probation_from: contract?.probation_from || '',
                    probation_to: contract?.probation_to || '',
                    duration_months: contract?.duration_months || '',
                    workplace: contract?.workplace || '',
                    job_title: contract?.job_title || '',
                    job_description: contract?.job_description || '',
                    salary: contract?.salary || '',
                    salary_grade: contract?.salary_grade || '',
                    salary_level: contract?.salary_level || '',
                    sign_date: contract?.sign_date || '',
                    contract_status: contract?.status || '',

                    /* ===== USER ACCOUNT ===== */
                    user_id: user?.id || '',
                    username: user?.username || '',
                    user_email: user?.email || '',
                    roles: user?.Roles?.map(r => r.name) || [],
                    is_login_disabled: user?.is_login_disabled || false,
                    is_inactive: user?.is_inactive || false,

                    /* ===== SYSTEM ===== */
                    status: emp?.status || 'active',

                    /* ===== SOCIAL ===== */
                    social_links: emp?.SocialLinks || [],
                });
            }
        };

        const fetchDepartments = async () => {
            const depts = await getDepartments();
            setDepartments(depts);
        }

        const fetchPositions = async () => {
            const pos = await getPositions();
            setPositions(pos);
        }

        fetchDepartments();
        fetchPositions();
        fetchEmployee();
    }, [id]);


    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' })); // xóa error khi user nhập
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['full_name', 'phone', 'gender', 'cccd'];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = 'Required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            if (formData.permanent_address) {
                const parts = formData.permanent_address
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);

                formData.place_of_birth = parts.at(-1) || null;
            }

            console.log('place_of_birth:', formData.place_of_birth);

            const res = await updateContract(id, formData);
            showNotification('Employee updated successfully', 'success');
        } catch (err) {
            console.error(err);
            alert('Cập nhật thất bại!');
        }

    };

    const convertContractTitle = (value) => {
        if (value == "PROBATION") return "Probation"
        if (value == "FIXED_TERM") return "Fixed-term"
        if (value == "INDEFINITE") return "Indefinite"
        if (value == "TRAINING") return "Training"
    }

    const CONTRACT_TYPE_OPTIONS = [
        { id: 'PROBATION', name: 'PROBATION' },
        { id: 'FIXED_TERM', name: 'FIXED_TERM' },
        { id: 'INDEFINITE', name: 'INDEFINITE' },
        { id: 'TRAINING', name: 'TRAINING'},
    ];

    const SALARY_GRADE_OPTIONS = [
        { id: 'Chuyên viên', name: 'Chuyên viên' },
        { id: 'Kỹ sư', name: 'Kỹ sư' },
        { id: 'Nhân viên', name: 'Nhân viên' },
        { id: 'Quản lý', name: 'Quản lý' },
        { id: 'Công nhân kỹ thuật', name: 'Công nhân kỹ thuật' }
    ];

    const SALARY_LEVEL_OPTIONS = [
        { id: '1', name: 'Bậc 1' },
        { id: '2', name: 'Bậc 2' },
        { id: '3', name: 'Bậc 3' },
        { id: '4', name: 'Bậc 4' },
        { id: '5', name: 'Bậc 5' }
    ];

    const CONTRACT_STATUS = [
        { id: 'DRAFT', name: 'DRAFT' },
        { id: 'ACTIVE', name: 'ACTIVE' },
        { id: 'EXPIRED', name: 'EXPIRED' }
    ];

    const ExportContract = async () => {
        try {
            await exportContract(id);
            showNotification('Contract exported successfully', 'success');
        } catch (err) {
            console.error(err);
            alert('Export contract failed: ' + err.message);
        }
    };

    return (
        <div className="contract-card">
            <div className="contract-header">
                <h3 className="contract-title">
                    Contract
                    <span
                        className={`contract-type-badge ${formData.contract_type?.toLowerCase()
                            }`}
                    >
                        {convertContractTitle(formData.contract_type)}
                    </span>
                </h3>

                <div className="contract-tabs">

                    <div className="contract-actions">
                        <button className="btn outline" onClick={ExportContract}>
                            Export Contract
                        </button>
                    </div>

                    <div
                        className={`contract-tab ${activeTab === 'contract' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contract')}
                    >
                        General info
                    </div>
                    <div
                        className={`contract-tab ${activeTab === 'salary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('salary')}
                    >
                        Salary
                    </div>
                    <div
                        className={`contract-tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        History
                    </div>
                </div>
            </div>

            {activeTab === 'contract' && (
                <>

                    <h4>1. Employee identification</h4>

                    <EditableRow
                        label="Employee code"
                        value={formData.employee_code}
                        onChange={v => updateField('employee_code', v)}
                        error={errors.employee_code}
                        placeholder='Employee code'
                        disabled
                    />

                    <h4>2. Personal information</h4>

                    <EditableRow
                        label="Full name"
                        value={formData.full_name}
                        onChange={v => updateField('full_name', v)}
                        error={errors.full_name}
                        placeholder='Full name'
                    />

                    <EditableRow
                        label="Gender"
                        type="radio"
                        value={formData.gender}
                        onChange={v => updateField('gender', v)}
                        options={['Male', 'Female', 'Other']}
                        error={errors.gender}
                    />

                    <EditableRow
                        label="Date of birth"
                        type="date"
                        value={formData.dob}
                        onChange={v => updateField('dob', v)}
                        placeholder='Date of birth'
                    />

                    <EditableRow
                        label="Place of birth"
                        value={formData.place_of_birth}
                        onChange={v => updateField('place_of_birth', v)}
                        placeholder='Place of birth'
                    />

                    <EditableRow
                        label="Nationality"
                        value={formData.nationality}
                        onChange={v => updateField('nationality', v)}
                        placeholder='Nationality'
                    />

                    <h4>3. Contact information</h4>

                    <EditablePhoneRow label="Phone">
                        <PhoneInput
                            country="vn"
                            value={formData.phone}
                            onChange={(v) => updateField('phone', v)}
                            inputStyle={{
                                width: '100%',
                                height: '38px',
                                border: '1px solid transparent',
                                borderRadius: '4px',
                            }}
                        />
                    </EditablePhoneRow>

                    <EditableRow
                        label="Email"
                        value={formData.email}
                        onChange={v => updateField('email', v)}
                        disabled
                    />


                    <EditableRow
                        label="Permanent address"
                        value={formData.permanent_address}
                        onChange={v => updateField('permanent_address', v)}
                        placeholder='Permanent address'
                        error={errors.permanent_address}
                    />


                    <EditableRow
                        label="Current address"
                        value={formData.address}
                        onChange={v => updateField('address', v)}
                        placeholder='Mailing address'
                        error={errors.address}
                    />

                    <h4>4. Legal information</h4>

                    <EditableRow
                        label="Citizen identification number"
                        value={formData.cccd}
                        onChange={v => updateField('cccd', v)}
                        placeholder='Citizen identification number'
                        error={errors.cccd}
                    />


                    <EditableRow
                        label="ID card issue date"
                        type="date"
                        value={formData.cccd_issue_date}
                        onChange={v => updateField('cccd_issue_date', v)}
                        placeholder='ID Card Issue Date'
                    />

                    <EditableRow
                        label="ID card issue place"
                        value={formData.cccd_issue_place}
                        onChange={v => updateField('cccd_issue_place', v)}
                        placeholder='ID card issue place'
                    />

                    <EditableRow
                        label="Labour book number"
                        type="number"
                        value={formData.labor_book_number}
                        onChange={v => updateField('labor_book_number', v)}
                        placeholder='Labour book number'
                    />

                    <EditableRow
                        label="Labour book issue date"
                        type="date"
                        value={formData.labor_book_issue_date}
                        onChange={v => updateField('labor_book_issue_date', v)}
                        placeholder='Labour book issue date'
                    />

                    <EditableRow
                        label="Labour book issue place"
                        value={formData.labor_book_issue_place}
                        onChange={v => updateField('labor_book_issue_place', v)}
                        placeholder='Labour book issue place'
                    />

                    <EditableRow
                        label="Profession"
                        value={formData.profession}
                        onChange={v => updateField('profession', v)}
                        placeholder='Profession'
                    />

                    <h4>5. Employment information</h4>

                    <EditableRow
                        label="Department"
                        type="select"
                        value={formData.department_id}
                        options={departments}
                        onChange={v => updateField('department_id', v)}
                        error={errors.department_id}
                        placeholder='Department'
                    />

                    <EditableRow
                        label="Join date"
                        type="date"
                        value={formData.join_date}
                        onChange={v => updateField('join_date', v)}
                        placeholder='Join date'
                    />

                    <EditableRow
                        label="Salary grade"
                        type="select"
                        value={formData.salary_grade}
                        options={SALARY_GRADE_OPTIONS}
                        onChange={v => updateField('salary_grade', v)}
                        error={errors.salary_grade}
                        placeholder='Salary grade'
                    />

                    <EditableRow
                        label="Salary level"
                        type="select"
                        value={formData.salary_level}
                        options={SALARY_LEVEL_OPTIONS}
                        onChange={v => updateField('salary_level', v)}
                        error={errors.salary_level}
                        placeholder='Salary level'
                    />


                    <EditableRow
                        label="Contract"
                        type="select"
                        value={formData.contract_type}
                        options={CONTRACT_TYPE_OPTIONS}
                        onChange={v => updateField('contract_type', v)}
                        error={errors.contract_type}
                        placeholder='Contract'
                    />


                    <EditableRow
                        label="Duration months"
                        type="number"
                        value={formData.duration_months}
                        onChange={v => updateField('duration_months', v)}
                        placeholder='Duration months'
                    />


                    {formData.contract_type === 'FIXED_TERM' && (
                        <>
                            <EditableRow
                                label="Start date"
                                type="date"
                                value={formData.start_date}
                                onChange={v => updateField('start_date', v)}
                                placeholder="Start date"
                            />

                            <EditableRow
                                label="End date"
                                type="date"
                                value={formData.end_date}
                                onChange={v => updateField('end_date', v)}
                                placeholder="End date"
                            />
                        </>
                    )}


                    {formData.contract_type === 'PROBATION' && (
                        <>
                            <EditableRow
                                label="Probation from"
                                type="date"
                                value={formData.probation_from}
                                onChange={v => updateField('probation_from', v)}
                                placeholder="Probation from"
                            />

                            <EditableRow
                                label="Probation to"
                                type="date"
                                value={formData.probation_to}
                                onChange={v => updateField('probation_to', v)}
                                placeholder="Probation to"
                            />
                        </>
                    )}

                      {formData.contract_type === 'TRAINING' && (
                        <>
                            <EditableRow
                                label="Start date"
                                type="date"
                                value={formData.start_date}
                                onChange={v => updateField('start_date', v)}
                                placeholder="Start date"
                            />

                            <EditableRow
                                label="End date"
                                type="date"
                                value={formData.end_date}
                                onChange={v => updateField('end_date', v)}
                                placeholder="End date"
                            />
                        </>
                    )}

                    <EditableRow
                        label="Workplace"
                        value={formData.workplace}
                        onChange={v => updateField('workplace', v)}
                        error={errors.workplace}
                        placeholder='Workplace'
                    />

                    <EditableRow
                        label="Job title"
                        value={formData.job_title}
                        onChange={v => updateField('job_title', v)}
                        error={errors.job_title}
                        placeholder='Job title'
                    />

                    <EditableRow
                        label="Position"
                        type="select"
                        value={formData.position_id}
                        options={positions}
                        onChange={v => updateField('position_id', v)}
                        error={errors.position_id}
                        placeholder='Position'
                    />

                    <EditableRow
                        type='textarea'
                        label="Job description"
                        value={formData.job_description}
                        onChange={v => updateField('job_description', v)}
                        error={errors.job_description}
                        placeholder='Job description'
                    />

                    <h4>6. Contract status</h4>

                    <EditableRow
                        label="Contract status"
                        type="select"
                        value={formData.contract_status}
                        options={CONTRACT_STATUS}
                        onChange={v => updateField('contract_status', v)}
                        error={errors.contract_status}
                        placeholder='Contract status'
                    />
                </>)}
            {activeTab === 'salary' && (
                <div style={{ padding: '20px 0' }}>
                    <p>💰 Salary info coming soon</p>
                </div>
            )}

            {activeTab === 'history' && (
                <div style={{ padding: '20px 0' }}>
                    <p>📜 Contract history</p>
                </div>
            )}


            <div className="save-bar">
                <button className="btn primary" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
}
