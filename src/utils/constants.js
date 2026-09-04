export const APP_CONFIG = {
  appName: 'Debo Management',
  organization: 'Debo Engineering',
  tagline: 'Production-Level Project & Task Management System',
  website: 'www.deboengineering.com',
  phone: '+251949540860',
  email: 'contact@deboengineering.com',
  navLinks: [
    { name: 'Projects', path: '/projects' },
    { name: 'Tasks', path: '/tasks' },
    { name: 'Teams', path: '/teams' },
    { name: 'Reports', path: '/reports' },
  ],
  publicNavLinks: [
    { name: 'Features', path: '/#features' },
    { name: 'Teams & Tech', path: '/#teams' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ],
};

export const INITIAL_USERS = [
  { id: 'u1', name: 'Refiya Seyifadin', email: 'rafiyaseyfedin@gmail.com', role: 'ADMIN', team: 'Management', avatar: 'RS' },
  { id: 'u2', name: 'Sead Nejib', email: 'sead@deboengineering.com', role: 'PROJECT_MANAGER', team: 'Frontend Web', avatar: 'SN' },
  { id: 'u3', name: 'Rihana Awel', email: 'rihana@deboengineering.com', role: 'TEAM_MEMBER', team: 'Backend Dev', avatar: 'RA' },
  { id: 'u4', name: 'Abdi Dechasa', email: 'abdi@deboengineering.com', role: 'TEAM_MEMBER', team: 'Mobile App', avatar: 'AD' },
  { id: 'u5', name: 'Elaaf Mohammed', email: 'elaaf@deboengineering.com', role: 'PROJECT_MANAGER', team: 'Corporate', avatar: 'EL' },
];

export const INITIAL_TEAMS = [];
export const INITIAL_PROJECTS = [];
export const INITIAL_TASKS = [];
