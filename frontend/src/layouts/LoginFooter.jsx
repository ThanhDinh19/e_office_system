import './LoginFooter.css';

export default function LoginFooter({ children }) {
  return (
    <div className="login-layout">
      <main className="login-content">
        {children}
      </main>

      <footer className="login-footer">
        © 2026 E-Office System · Version 1.0
      </footer>
    </div>
  );
}
