import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/forgot-password',
        { email }
      );
      setToken(res.data.resetToken);
    } catch (err) {
      setError('Email không tồn tại');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Quên mật khẩu</h2>
        <p className="login-subtitle">Nhập email để lấy mã reset</p>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="login-button">Lấy mã reset</button>

        {token && (
          <div className="reset-token-box">
            <p><strong>Reset token (dev):</strong></p>
            <small>{token}</small>
            <Link to="/reset-password">Đặt lại mật khẩu</Link>
          </div>
        )}

        <div className="login-links">
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
}
