import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../contexts';
import { authService } from '../services';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAccessibility, setShowAccessibility] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { theme, updateTheme, preferences, updatePreferences } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login({ email, password });
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleAccessibilityConfig = () => {
    setShowAccessibility(true);
  };

  const handleSkipAccessibility = () => {
    navigate('/acessibilidade');
  };

  if (showAccessibility) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Configurações de Acessibilidade</h1>
            <p className="text-gray-600 mt-2">Personalize sua experiência</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['claro', 'escuro', 'auto'].map((tema) => (
                  <button
                    key={tema}
                    onClick={() => updateTheme(tema)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      theme === tema
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tema === 'claro' && '☀️ Claro'}
                    {tema === 'escuro' && '🌙 Escuro'}
                    {tema === 'auto' && '⚡ Auto'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Alto Contraste
              </label>
              <button
                onClick={() => updatePreferences({ altoContraste: !preferences.altoContraste })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.altoContraste ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.altoContraste ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamanho da Fonte
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['pequeno', 'medio', 'grande', 'muito_grande'].map((tamanho) => (
                  <button
                    key={tamanho}
                    onClick={() => updatePreferences({ tamanhoFonte: tamanho })}
                    className={`p-2 rounded border transition-colors ${
                      preferences.tamanhoFonte === tamanho
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tamanho === 'pequeno' && 'A'}
                    {tamanho === 'medio' && 'A'}
                    {tamanho === 'grande' && 'A'}
                    {tamanho === 'muito_grande' && 'A'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => navigate('/')}
              className="w-full"
            >
              Continuar para o Sistema
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">BYTEWAVE</h1>
          <p className="text-gray-600 mt-2">Evoluimos com a onda da tecnologia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Input
            label="Email ou CPF"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="exemplo@gmail.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            {loading ? 'Entrando...' : 'Confirmar'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center mb-3">
            Precisa de opções de acessibilidade?
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleAccessibilityConfig}
              className="flex-1"
            >
              Sim, acessar
            </Button>
            <Button
              variant="outline"
              onClick={handleSkipAccessibility}
              className="flex-1"
            >
              Não, continuar
            </Button>
            // No return do Login, adicione isso depois do botão:
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Não tem uma conta?{" "}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
          <p className="text-xs text-blue-600 text-center mt-2">
            Você pode alterar as preferências de acessibilidade a qualquer momento no menu lateral.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;