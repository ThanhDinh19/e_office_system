export const SIDEBAR_CONFIG = {
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Event', path: '/admin/roles' },
    { label: 'Projects', path: '/admin/departments' },
    { label: 'User Management', path: '/admin/users' },
  ],

  HR: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Nhân sự', path: '/employees' },
    { label: 'Hợp đồng', path: '/contracts' },
    { label: 'Nghỉ phép', path: '/leave-requests' },
  ],

  MANAGER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Nhân viên phòng ban', path: '/team' },
    { label: 'Duyệt nghỉ', path: '/approve-leave' },
    { label: 'Công việc', path: '/tasks' },
  ],

  STAFF: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Thông tin cá nhân', path: '/profile' },
    { label: 'Nghỉ phép của tôi', path: '/my-leave' },
    { label: 'Công việc', path: '/my-tasks' },
  ],

  IT_SUPPORT: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Ticket', path: '/tickets' },
    { label: 'Tài sản', path: '/assets' },
  ],
};
