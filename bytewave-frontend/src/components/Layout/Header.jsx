import React, { useState } from 'react';
import { useAuth, useTheme } from '../../contexts';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Accessibility 
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, updateTheme, preferences, updatePreferences } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const toggleTheme = (newTheme) => {
    updateTheme(newTheme);
    setShowThemeMenu(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              BYTEWAVE
            </h1>
            <span className="ml-2 text-sm text-gray-500">
              Evoluimos com a onda da tecnologia
            </span>
          </div>

          {/* Direita */}
          <div className="flex items-center space-x-4">
            {/* Botão Acessibilidade */}
            <button
              onClick={() => updatePreferences({ altoContraste: !preferences.altoContraste })}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Alternar alto contraste"
            >
              <Accessibility size={20} />
            </button>

            {/* Botão Tema */}
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Alterar tema"
              >
                {theme === 'escuro' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => toggleTheme('claro')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Sun size={16} className="mr-2" />
                    Tema Claro
                  </button>
                  <button
                    onClick={() => toggleTheme('escuro')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Moon size={16} className="mr-2" />
                    Tema Escuro
                  </button>
                  <button
                    onClick={() => toggleTheme('auto')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-2" />
                    Automático
                  </button>
                </div>
              )}
            </div>

            {/* Notificações */}
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Menu do Usuário */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.nome || user?.username}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.nome}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-blue-600 capitalize">{user?.tipo}</p>
                  </div>
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-2" />
                    Meu Perfil
                  </button>
                  
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-2" />
                    Configurações
                  </button>
                  
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;