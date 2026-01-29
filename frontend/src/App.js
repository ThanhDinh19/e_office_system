import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginFooter from './layouts/LoginFooter';
import Register from './pages/auth/Register';
import ForgetPassword from './pages/auth/ForgetPassword';
import PublicRoute from './routes/PublicRoute';
import UserManagement from './pages/admin/UserManagement';
import EmployeeProfile from './pages/admin/EmployeeProfile/EmployeeProfile';
import { NotificationProvider } from './context/NotificationContext';
import ProjectManagement from './pages/admin/ProjectManagement';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/login" element={<LoginFooter> <Login /> </LoginFooter> } />
   
          <Route path="/register" element={<LoginFooter> <Register /> </LoginFooter> } />

          <Route path="/forget-password" element={<LoginFooter> <ForgetPassword /> </LoginFooter> } /> */}

            {/* Admin : quản lý người dùng */}
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* quản lý project - tasks */}
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <MainLayout>
                    <ProjectManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />


            {/* Đổi mật khẩu */}
            <Route path="/profile" element={<ProtectedRoute><MainLayout><div>Profile page</div></MainLayout></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><MainLayout><div>Change password</div></MainLayout></ProtectedRoute>} />

            {/* Redirect mặc định */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginFooter>
                    <Login />
                  </LoginFooter>
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <LoginFooter>
                    <Register />
                  </LoginFooter>
                </PublicRoute>
              }
            />

            <Route
              path="/forget-password"
              element={
                <PublicRoute>
                  <LoginFooter>
                    <ForgetPassword />
                  </LoginFooter>
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/employees/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EmployeeProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
