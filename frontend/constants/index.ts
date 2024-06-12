import {
  BarChart,
  BarChart4,
  CircleCheck,
  FileText,
  Home,
  Star,
  Users,
} from 'lucide-react';

export const navLinks = [
  { id: 1, name: 'Home', href: '/', icon: Home },
  { id: 2, name: 'Employees', href: '/employees', icon: Users },
  { id: 6, name: 'Polls', href: '/polls', icon: BarChart },
  { id: 3, name: 'Tasks', href: '/tasks', icon: CircleCheck },
  { id: 4, name: 'Opinions', href: '/opinions', icon: Star },
  { id: 5, name: 'Analytics', href: '/analytics', icon: BarChart4 },
  { id: 7, name: "PTO's", href: '/pto', icon: FileText },
];
