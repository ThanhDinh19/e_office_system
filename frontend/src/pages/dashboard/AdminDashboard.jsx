import './AdminDashboard.css';


export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      {/* ===== Header ===== */}
      <div className="ad-header">
        <h2>Admin Dashboard</h2>
        <p>E-Office management system</p></div>

      {/* ===== Stats ===== */}
      <div className="ad-stats">
        <StatCard title="Users" value="128" />
        <StatCard title="Employees" value="120" />
        <StatCard title="Departments" value="8" />
        <StatCard title="Roles" value="5" />
      </div>

      {/* ===== Main Grid ===== */}
      <div className="ad-grid">
        {/* System Overview */}
        <div className="ad-card">
          <h3>System overview</h3>
          <ul className="overview-list">
            <li>
              <span>Active users</span>
              <strong>110</strong>
            </li>
            <li>
              <span>Locked accounts</span>
              <strong className="danger">3</strong>
            </li>
            <li>
              <span>Inactive employees</span>
              <strong>5</strong>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="ad-card">
          <h3>Quick actions</h3>
          <div className="quick-actions">
            <button className="primary">+ Add Employee</button>
            <button>+ Create User</button>
            <button>Manage Roles</button>
            <button>Departments</button>
          </div>
        </div>
      </div>

      {/* ===== Activity ===== */}
      <div className="ad-card">
        <h3>Recent activities</h3>
        <ul className="activity-list">
          <li>Admin created user <strong>staff01</strong></li>
          <li>User <strong>hr01</strong> was locked</li>
          <li>Role <strong>MANAGER</strong> updated</li>
        </ul>
      </div>
    </div>
  );
}

/* ===== Small components ===== */

const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <span>{title}</span>
    <strong>{value}</strong>
  </div>
);
