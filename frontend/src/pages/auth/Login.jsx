import { useState } from 'react';
import { login as loginApi } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { Link } from 'react-router-dom';
import Register from './Register';
import ForgetPassword from './ForgetPassword';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(username, password);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">E-OFFICE</h2>
        <p className="login-subtitle">Sign in to the system</p>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-button" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="login-links">
          <Link to="/forget-password">Forgot password?</Link>
          <Link to="/register">Register account</Link>
        </div>
      </form>

      <div className="demo-account-container">
        <p className="demo-title">Login as demo account</p>

        <div
          className="demo-item admin"
          onClick={() => {
            setUsername('admin');
            setPassword('admin123');
          }}
        >
          <span className="role">ADMIN</span>
          <span className="credential">admin / admin123</span>
        </div>

        <div
          className="demo-item hr"
          onClick={() => {
            setUsername('hr01');
            setPassword('hr123');
          }}
        >
          <span className="role">HR</span>
          <span className="credential">hr01 / hr123</span>
        </div>

        <div
          className="demo-item staff"
          onClick={() => {
            setUsername('staff01');
            setPassword('staff123');
          }}
        >
          <span className="role">STAFF</span>
          <span className="credential">staff01 / staff123</span>
        </div>

        <div
          className="demo-item manager"
          onClick={() => {
            setUsername('manager01');
            setPassword('manager123');
          }}
        >
          <span className="role">MANAGER</span>
          <span className="credential">manager01 / manager123</span>
        </div>
      </div>
    </div>
  );
}
