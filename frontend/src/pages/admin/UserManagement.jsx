import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { getUsers, deactivateUser } from '../../services/adminUser.service';
import ConfirmModal from '../../components/common/ConfirmModal';
import './UserManagement.css';
import AddEmployeeWizard from '../employees/AddEmployeeWizard';
import { Link } from 'react-router-dom';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [is_inactiveTab, setInActiveTab] = useState(false);
    const [openWizard, setOpenWizard] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = currentUser?.id;

    const fetchUsers = async () => {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Loading...</p>;

    // Filter by status
    let filteredUsers = users.filter(
        (u) => u.is_inactive === is_inactiveTab
    );

    // Filter by search term (name, email, phone)
    if (searchTerm) {
        filteredUsers = filteredUsers.filter((u) => {
            const fullName = u.Employee?.full_name || '';
            const email = u.email || '';
            const phone = u.Employee?.phone || '';
            const searchLower = searchTerm.toLowerCase();

            return (
                fullName.toLowerCase().includes(searchLower) ||
                email.toLowerCase().includes(searchLower) ||
                phone.toLowerCase().includes(searchLower)
            );
        });
    }

    // Export to Excel
    const handleExportExcel = () => {
        if (filteredUsers.length === 0) {
            alert('No data to export');
            return;
        }

        const excelData = filteredUsers.map((user) => ({
            'Tên nhân viên': user.Employee?.full_name || '',
            'Chức vụ': user.Employee?.Position?.name || '',
            'Email': user.email || '',
            'Số điện thoại': user.Employee?.phone || '',
            'Trạng thái': user.status === 'active' ? 'Hoạt động' : 'Vô hiệu',
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Team Members');

        // Set column width
        worksheet['!cols'] = [
            { wch: 20 },
            { wch: 15 },
            { wch: 25 },
            { wch: 15 },
            { wch: 12 },
        ];

        const fileName = `Team_Members_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <>
            {/* ===== Header ===== */}
            <div className="um-header">
                <h2>Team members</h2>

                <div className="um-actions">
                    <button className="btn">Import team members</button>
                    <button className="btn">Send invitation</button>
                    <button
                        className="btn primary"
                        onClick={() => setOpenWizard(true)}
                    >
                        + Add member
                    </button>
                </div>
            </div>

            {/* ===== Tabs + Tools ===== */}
            <div className="um-toolbar">
                <div className="um-tabs">
                    <button
                        className={is_inactiveTab === false ? 'active' : ''}
                        onClick={() => setInActiveTab(false)}
                    >
                        Active members
                    </button>
                    <button
                        className={is_inactiveTab === true ? 'active' : ''}
                        onClick={() => setInActiveTab(true)}
                    >
                        Inactive members
                    </button>
                </div>

                <div className="um-tools">
                    <button className="btn small" onClick={handleExportExcel}>Excel</button>
                    <button className="btn small">Print</button>
                    <input
                        className="search"
                        placeholder="Search name, email, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* ===== Table ===== */}
            <div className="table-wrapper">
                <table className="member-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Job Title</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="name-cell">
                                    <Link
                                        to={`/admin/employees/${user.Employee?.id}`}
                                        className="name-link"
                                    >
                                        <div className="avatar">
                                            {user.Employee?.avatar ? (
                                                <img
                                                    src={`http://localhost:5000${user.Employee.avatar}`}
                                                    alt={user.Employee.full_name}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <span className="avatar-text">
                                                    {user.Employee?.full_name?.charAt(0) || 'U'}
                                                </span>
                                            )}
                                        </div>
                                        <span>{user.Employee?.full_name}</span>
                                    </Link>
                                </td>

                                <td>{user.Employee?.Position?.name}</td>
                                <td>{user.email}</td>
                                <td>{user.Employee?.phone}</td>

                                <td>
                                    {user.id !== currentUserId ? (
                                        <button
                                            className="delete-icon"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setShowModal(true);
                                            }}
                                        >
                                            ×
                                        </button>
                                    ) : (
                                        <span className="self-user">🔒</span>
                                    )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ===== Confirm Modal ===== */}
            <ConfirmModal
                open={showModal}
                title="Remove member"
                message={`Are you sure you want to remove "${selectedUser?.Employee?.full_name}"?`}
                onCancel={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                onConfirm={async () => {
                    try {
                        await deactivateUser(selectedUser?.id);

                        setShowModal(false);
                        setSelectedUser(null);

                        await fetchUsers(); // reload danh sách

                    } catch (err) {
                        console.error(err);
                        alert('Remove user failed');
                    }
                }}
            />


            {/* AddEmployee Modal */}
            <AddEmployeeWizard
                open={openWizard}
                onClose={() => setOpenWizard(false)}
                onSuccess={fetchUsers}
            />

        </>
    );
}
