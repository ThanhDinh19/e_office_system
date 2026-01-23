import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/api/auth/reset-password', {
      token,
      newPassword: password,
    });
    navigate('/login');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Đặt lại mật khẩu</h2>

        <div className="form-group">
          <label>Reset token</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-button">Cập nhật mật khẩu</button>
      </form>
    </div>
  );
}
