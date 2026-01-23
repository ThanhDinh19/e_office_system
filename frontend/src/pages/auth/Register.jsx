import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3000/api/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError('Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng ký</h2>
        <p className="login-subtitle">Tạo tài khoản mới</p>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <button className="login-button" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>

        <div className="login-links">
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}
