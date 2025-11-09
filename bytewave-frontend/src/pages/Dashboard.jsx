import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts';
import { dashboardService } from '../services';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user, userType } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        let data;
        if (userType === 'aluno') {
          data = await dashboardService.getDashboardAluno();
        } else if (userType === 'professor') {
          data = await dashboardService.getDashboardProfessor();
        } else {
          data = await dashboardService.getDashboardAdmin();
        }
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [userType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderAlunoDashboard = () => (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Atividades Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.atividades_pendentes || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trabalhos Entregues</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.trabalhos?.Entregue || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Presenças</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.presencas?.Presente || 0}/
                {dashboardData?.estatisticas?.presencas?.total || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Bell className="text-purple-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notificações</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.notificacoes_nao_lidas || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Próximas Atividades */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Próximas Atividades</h2>
          <Button variant="outline" size="small">
            Ver Todas
          </Button>
        </div>
        <div className="space-y-3">
          {dashboardData?.proximas_atividades?.map((atividade) => (
            <div key={atividade.id_atividade} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{atividade.titulo}</p>
                <p className="text-sm text-gray-600">{atividade.Turma?.nome}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {new Date(atividade.data_entrega).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(atividade.data_entrega).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          {(!dashboardData?.proximas_atividades || dashboardData.proximas_atividades.length === 0) && (
            <p className="text-center text-gray-500 py-4">Nenhuma atividade próxima</p>
          )}
        </div>
      </Card>

      {/* Feed Recente */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Feed Recente</h2>
        <div className="space-y-4">
          {dashboardData?.feed_recente?.map((post) => (
            <div key={post.id_post} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {post.autor?.autor_nome?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{post.autor?.autor_nome}</p>
                  <p className="text-gray-600 mt-1">{post.conteudo}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{new Date(post.criado_em).toLocaleDateString('pt-BR')}</span>
                    <span>💬 {post.total_comentarios || 0}</span>
                    <span>👍 {post.total_reacoes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {(!dashboardData?.feed_recente || dashboardData.feed_recente.length === 0) && (
            <p className="text-center text-gray-500 py-4">Nenhum post recente</p>
          )}
        </div>
      </Card>
    </div>
  );

  const renderProfessorDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Turmas</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.total_turmas || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="text-green-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alunos</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.total_alunos || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="text-orange-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Atividades</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.total_atividades || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Para Corrigir</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.estatisticas?.trabalhos_para_corrigir || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Aulas da Semana */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Aulas da Semana</h2>
          <div className="space-y-3">
            {dashboardData?.aulas_semana?.map((aula) => (
              <div key={aula.id_aula} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{aula.Disciplina?.nome}</p>
                  <p className="text-sm text-gray-600">{aula.Turma?.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(aula.data_aula).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {aula.hora_inicio} - {aula.hora_fim}
                  </p>
                </div>
              </div>
            ))}
            {(!dashboardData?.aulas_semana || dashboardData.aulas_semana.length === 0) && (
              <p className="text-center text-gray-500 py-4">Nenhuma aula esta semana</p>
            )}
          </div>
        </Card>

        {/* Agendamentos de Hoje */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Agendamentos de Hoje</h2>
          <div className="space-y-3">
            {dashboardData?.agendamentos_hoje?.map((agendamento) => (
              <div key={agendamento.id_agendamento} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{agendamento.titulo}</p>
                  <p className="text-sm text-gray-600">{agendamento.Sala?.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {agendamento.hora_inicio} - {agendamento.hora_fim}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{agendamento.tipo_evento}</p>
                </div>
              </div>
            ))}
            {(!dashboardData?.agendamentos_hoje || dashboardData.agendamentos_hoje.length === 0) && (
              <p className="text-center text-gray-500 py-4">Nenhum agendamento hoje</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {user?.nome || user?.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta ao ByteWave
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp size={16} />
          <span>Último acesso: {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {userType === 'aluno' && renderAlunoDashboard()}
      {userType === 'professor' && renderProfessorDashboard()}
      {userType === 'admin' && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard Admin</h2>
          <p className="text-gray-600 mt-2">Em desenvolvimento</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;