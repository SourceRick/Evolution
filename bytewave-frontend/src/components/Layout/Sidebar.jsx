import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  Calendar, 
  Bell, 
  MessageSquare,
  BarChart3,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts';

const Sidebar = () => {
  const location = useLocation();
  const { userType } = useAuth();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: Home,
      roles: ['admin', 'professor', 'aluno']
    },
    {
      name: 'Cursos',
      path: '/cursos',
      icon: BookOpen,
      roles: ['admin', 'professor', 'aluno']
    },
    {
      name: 'Turmas',
      path: '/turmas',
      icon: Users,
      roles: ['admin', 'professor', 'aluno']
    },
    {
      name: 'Atividades',
      path: '/atividades',
      icon: FileText,
      roles: ['admin', 'professor', 'aluno']
    },
    {
      name: 'Agendamentos',
      path: '/agendamentos',
      icon: Calendar,
      roles: ['admin', 'professor']
    },
    {
      name: 'Feed',
      path: '/feed',
      icon: MessageSquare,
      roles: ['admin', 'professor', 'aluno']
    },
    {
      name: 'Mensagens',
      path: '/mensagens',
      icon: Bell,
      roles: ['admin', 'professor', 'aluno']
    },
    {
      name: 'Relatórios',
      path: '/relatorios',
      icon: BarChart3,
      roles: ['admin', 'professor']
    },
    {
      name: 'Configurações',
      path: '/configuracoes',
      icon: Settings,
      roles: ['admin', 'professor', 'aluno']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userType)
  );

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                ${active 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;