import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FolderKanban,
  CheckSquare,
  UserCog,
  LifeBuoy,
  Folder,
  BarChart3,
  Settings,
} from 'lucide-react';

export const SIDEBAR_CONFIG = {
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/roles', icon: CalendarDays },
    { label: 'Client', path: '/admin/client', icon: Users },
    { label: 'Projects', path: '/admin/departments', icon: FolderKanban },
    { label: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { label: 'User Management', path: '/admin/users', icon: UserCog },
    { label: 'Tickets', path: '/admin/tickets', icon: LifeBuoy },
    { label: 'File', path: '/admin/files', icon: Folder },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ],

  HR: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Employees', path: '/employees' },
    { label: 'Contracts', path: '/contracts' },
    { label: 'Leave Requests', path: '/leave-requests' },
  ],

  MANAGER: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Department Staff', path: '/team' },
    { label: 'Leave Approvals', path: '/approve-leave' },
    { label: 'Tasks', path: '/tasks' },
  ],

  STAFF: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Profile', path: '/profile' },
    { label: 'My Leave Requests', path: '/my-leave' },
    { label: 'My Tasks', path: '/my-tasks' },
  ],

  IT_SUPPORT: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tickets', path: '/tickets' },
    { label: 'Assets', path: '/assets' },
  ],
};
