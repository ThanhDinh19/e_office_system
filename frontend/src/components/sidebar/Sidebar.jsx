import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SIDEBAR_CONFIG } from '../../config/sidebar.config';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();
  const roles = user?.roles || [];

  // Ưu tiên role cao nhất
  const primaryRole =
    roles.includes('ADMIN') ? 'ADMIN'
    : roles.includes('HR') ? 'HR'
    : roles.includes('MANAGER') ? 'MANAGER'
    : roles.includes('STAFF') ? 'STAFF'
    : roles.includes('IT_SUPPORT') ? 'IT_SUPPORT'
    : null;

  const menus = SIDEBAR_CONFIG[primaryRole] || [];

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">E-OFFICE</h3>

      <ul className="menu">
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'menu-item active' : 'menu-item'
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
