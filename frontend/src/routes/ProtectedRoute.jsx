import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.some(r => user.roles.includes(r))) {
    return <div>403 - Không có quyền</div>;
  }

  return children;
}
