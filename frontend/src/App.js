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
import AddProjectWizard from '../src/pages/admin/projects/AddProjectWizard/AddProjectWizard';
import TicketPage from './pages/staff/tickets/TicketPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ITServiceManagement from './pages/admin/ITServiceManagement';


function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          {/* Toast global */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
          <Routes>
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

            {/* quản lý tickets */}
            <Route
              path="/admin/tickets"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TicketPage />
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

            {/* quản lý it services */}
            <Route
              path="/admin/itservices"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <MainLayout>
                    <ITServiceManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/projects/new"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <MainLayout>
                    <AddProjectWizard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/projects/:id/edit"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <MainLayout>
                    <AddProjectWizard />
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

            {/* staff */}
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <TicketPage />
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




//  <Route path="/login" element={<LoginFooter> <Login /> </LoginFooter> } />
   
//           <Route path="/register" element={<LoginFooter> <Register /> </LoginFooter> } />

//           <Route path="/forget-password" element={<LoginFooter> <ForgetPassword /> </LoginFooter> } />