import {
  BarChart,
  BarChart4,
  Building,
  CircleCheck,
  FileQuestion,
  FileText,
  Home,
  Lock,
  NotepadText,
  Star,
  TriangleAlert,
  User,
  Users,
} from 'lucide-react';

export const navLinks = [
  { id: 1, name: 'Home', href: '/', icon: Home },
  { id: 2, name: 'Employees', href: '/employees', icon: Users },
  { id: 6, name: 'Polls', href: '/polls', icon: BarChart },
  { id: 3, name: 'Tasks', href: '/tasks', icon: CircleCheck },
  { id: 4, name: 'Surveys', href: '/surveys', icon: NotepadText },
  { id: 5, name: 'Analytics', href: '/analytics', icon: BarChart4 },
  { id: 8, name: 'Questions', href: '/questions', icon: FileQuestion },
  { id: 7, name: "PTO's", href: '/pto', icon: FileText },
];

export const settingsLinks = [
  { id: 1, name: 'Profile', view: 'profile', icon: User },
  { id: 2, name: 'Security', view: 'security', icon: Lock },
  { id: 3, name: 'Company', view: 'company', icon: Building },
  {
    id: 4,
    name: 'Danger',
    view: 'danger',
    icon: TriangleAlert,
    specialClass: 'text-red-500',
  },
];
