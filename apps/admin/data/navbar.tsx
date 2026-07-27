// lib/admin-routes.ts
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
} from "react-icons/lu";
import { AdminRoute } from "types/navbar";

export const adminRoutes: AdminRoute[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LuLayoutDashboard,
    active: true
  },
  { label: "Blogs", path: "/blogs", icon: LuNewspaper, active: false },
  { label: "Contact", path: "/admin/contact", icon: LuMail, active: false },
  {
    label: "Experience",
    path: "/admin/experience",
    icon: LuBriefcase,
    active: false
  },
  {
    label: "Portfolio",
    path: "/admin/portfolio",
    icon: LuFolderKanban,
    active: false
  },
  { label: "Profile", path: "/admin/profile", icon: LuCircle, active: false },
  { label: "Skills", path: "/admin/skills", icon: LuSparkles, active: false },
  {
    label: "Testimonial",
    path: "/admin/testimonial",
    icon: LuMessageSquareQuote,
    active: false
  },
  { label: "Tools", path: "/admin/tools", icon: LuWrench, active: false },
  { label: "Users", path: "/admin/users", icon: LuUsers, active: false }
];
