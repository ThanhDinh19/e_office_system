import { useAuth } from '../../context/AuthContext';
import StaffDashboard from './StaffDashboard';
import ManagerDashboard from './ManagerDashboard';
import HRDashboard from './HRDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  const roles = user.roles;

 if (roles.includes('ADMIN')) return <AdminDashboard />;
  if (roles.includes('HR')) return <HRDashboard />;
  if (roles.includes('MANAGER')) return <ManagerDashboard />;
  if (roles.includes('STAFF')) return <StaffDashboard />;

  return <div>Không có quyền truy cập</div>;
}
