import {
  LuLayoutDashboard,
  LuNewspaper,
  LuMail,
  LuBriefcase,
  LuFolderKanban,
  LuCircle,
  LuSparkles,
  LuMessageSquareQuote,
  LuWrench,
  LuUsers
} from '@repo/icons/lu';
import { AdminRoute } from 'types/navbar';

export const adminRoutes: AdminRoute[] = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LuLayoutDashboard,
    active: true
  },
  { label: 'Blogs', path: '/admin/blogs', icon: LuNewspaper, active: true },
  {
    label: 'Experience',
    path: '/admin/experience',
    icon: LuBriefcase,
    active: true
  },
  {
    label: 'Portfolio',
    path: '/admin/portfolio',
    icon: LuFolderKanban,
    active: true
  },
  { label: 'Profile', path: '/admin/profile', icon: LuCircle, active: true },
  { label: 'Skills', path: '/admin/skills', icon: LuSparkles, active: true },
  {
    label: 'Testimonial',
    path: '/admin/testimonial',
    icon: LuMessageSquareQuote,
    active: true
  },
  { label: 'Tools', path: '/admin/tools', icon: LuWrench, active: true },
  { label: 'Contact', path: '/admin/contact', icon: LuMail, active: true },
  { label: 'Users', path: '/admin/users', icon: LuUsers, active: false }
];
