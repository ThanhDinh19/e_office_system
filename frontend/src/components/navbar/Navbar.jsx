import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();   

  // click outside để đóng menu
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">E-OFFICE</span>
      </div>

      <div className="navbar-right" ref={menuRef}>
        <div className="user-info" onClick={() => setOpen(!open)}>
          <img
            src="https://ui-avatars.com/api/?name=User&background=2563eb&color=fff"
            alt="avatar"
            className="avatar"
          />
          <span className="username">{user?.username}</span>
        </div>

        {open && (
          <div className="dropdown">
            <div className="dropdown-item" onClick={() => navigate('/admin/employees/' + user?.id)}>
              👤 Trang cá nhân
            </div>
            <div className="dropdown-item" onClick={() => navigate('/change-password')}>
              🔑 Đổi mật khẩu
            </div>
            <div className="dropdown-divider" />
            <div className="dropdown-item logout" onClick={handleLogout}>
              🚪 Đăng xuất
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
