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
  Wrench,
} from 'lucide-react';

export const SIDEBAR_CONFIG = {
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/admin/roles', icon: CalendarDays },
    { label: 'Client', path: '/admin/client', icon: Users },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { label: 'Members', path: '/admin/users', icon: UserCog },
    { label: 'Tickets', path: '/admin/tickets', icon: LifeBuoy },
    { label: 'IT Services', path: '/admin/itservices', icon: Wrench},
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
    {label: 'Dashboard',path: '/dashboard',icon: LayoutDashboard,},
    {label: 'Tickets', path: '/tickets',icon: FolderKanban,},
    {label: 'Leave Requests', path: '/my-leave', icon: CalendarDays,},
    {label: 'My Tasks',path: '/my-tasks',icon: CheckSquare,},
  ],


  IT_SUPPORT: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tickets', path: '/tickets' },
    { label: 'Assets', path: '/assets' },
  ],
};
