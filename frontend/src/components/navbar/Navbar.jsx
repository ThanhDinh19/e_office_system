import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import {
  Menu,
  CheckCircle,
  LayoutGrid,
  Briefcase,
  Monitor,
  Gauge,
  Search,
  Plus,
  Globe,
  Clock,
  Bell,
  Mail
} from "lucide-react";

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
         <div className='icon-feature'>
          <Menu size={20} />
          <CheckCircle size={20} />
          <LayoutGrid size={20} />
          <Briefcase size={20} />
          <Monitor size={20} />
          <Gauge size={20} />
        </div>
      </div>

      <div className='navbar-right'>

        <div className='icon-feature'>
          <Plus size={20} />
          <Globe size={20} />
          <Clock size={20} />
          <Search size={20} />
          <Bell size={20} />
          <Mail size={20} />
        </div>

        <div className="navbar-profile" ref={menuRef}>

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

      </div>
    </header>
  );
}
