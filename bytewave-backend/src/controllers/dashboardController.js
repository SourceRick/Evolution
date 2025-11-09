const { 
  User, Aluno, Professor, Turma, Curso, Atividade, Trabalho, 
  Aula, Presenca, Post, Notificacao, Matricula 
} = require('../models');
const { Op, Sequelize } = require('sequelize');

const dashboardController = {
  async getDashboardAluno(req, res) {
    try {
      const userId = req.userId;

      // Buscar aluno
      const aluno = await Aluno.findOne({
        where: { id_aluno: userId },
        include: [{
          model: Matricula,
          where: { status: 'Ativa' },
          include: [{
            model: Turma,
            include: [{
              model: Curso,
              attributes: ['nome', 'codigo']
            }]
          }]
        }]
      });

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const turmaIds = aluno.Matriculas.map(m => m.id_turma);

      // Estatísticas de atividades
      const atividades = await Atividade.count({
        where: { 
          id_turma: { [Op.in]: turmaIds },
          ativa: true,
          data_entrega: { [Op.gte]: new Date() }
        }
      });

      const trabalhos = await Trabalho.findAll({
        where: { id_aluno: userId },
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id_trabalho')), 'quantidade']
        ],
        group: ['status']
      });

      // Presenças do último mês
      const umMesAtras = new Date();
      umMesAtras.setMonth(umMesAtras.getMonth() - 1);

      const presencas = await Presenca.findAll({
        where: { 
          id_aluno: userId,
          '$Aula.data_aula$': { [Op.gte]: umMesAtras }
        },
        include: [{
          model: Aula,
          attributes: []
        }],
        attributes: [
          'status',
          [Sequelize.fn('COUNT', Sequelize.col('id_presenca')), 'quantidade']
        ],
        group: ['status']
      });

      // Notificações não lidas
      const notificacoesNaoLidas = await Notificacao.count({
        where: { 
          id_usuario: userId,
          lida: false
        }
      });

      // Próximas atividades
      const proximasAtividades = await Atividade.findAll({
        where: { 
          id_turma: { [Op.in]: turmaIds },
          ativa: true,
          data_entrega: { 
            [Op.between]: [new Date(), new Date(new Date().setDate(new Date().getDate() + 7))]
          }
        },
        include: [{
          model: Turma,
          attributes: ['nome']
        }],
        order: [['data_entrega', 'ASC']],
        limit: 5
      });

      // Posts recentes
      const postsRecentes = await Post.findAll({
        where: { 
          [Op.or]: [
            { id_turma: { [Op.in]: turmaIds } },
            { visibilidade: 'Publico' }
          ],
          ativo: true
        },
        include: [{
          model: User,
          as: 'autor',
          include: [
            { model: Professor, attributes: ['nome', 'foto_url'] },
            { model: Aluno, attributes: ['nome', 'foto_url'] }
          ]
        }],
        order: [['criado_em', 'DESC']],
        limit: 5
      });

      const dashboard = {
        aluno: {
          id: aluno.id_aluno,
          nome: aluno.nome,
          foto_url: aluno.foto_url,
          turmas: aluno.Matriculas.map(m => ({
            id: m.Turma.id_turma,
            nome: m.Turma.nome,
            curso: m.Turma.Curso.nome
          }))
        },
        estatisticas: {
          atividades_pendentes: atividades,
          notificacoes_nao_lidas: notificacoesNaoLidas,
          trabalhos: trabalhos.reduce((acc, t) => {
            acc[t.status] = parseInt(t.get('quantidade'));
            return acc;
          }, {}),
          presencas: presencas.reduce((acc, p) => {
            acc[p.status] = parseInt(p.get('quantidade'));
            return acc;
          }, {})
        },
        proximas_atividades: proximasAtividades,
        feed_recente: postsRecentes
      };

      res.json(dashboard);
    } catch (error) {
      console.error('Erro no dashboard aluno:', error);
      res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
  },

  async getDashboardProfessor(req, res) {
    try {
      const userId = req.userId;

      // Buscar professor
      const professor = await Professor.findByPk(userId, {
        include: [{
          model: Turma,
          as: 'coordenador',
          include: [{
            model: Curso,
            attributes: ['nome', 'codigo']
          }]
        }]
      });

      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      const turmaIds = professor.Turmas.map(t => t.id_turma);

      // Estatísticas
      const totalTurmas = turmaIds.length;
      
      const totalAlunos = await Matricula.count({
        where: { 
          id_turma: { [Op.in]: turmaIds },
          status: 'Ativa'
        }
      });

      const atividades = await Atividade.count({
        where: { 
          id_professor: userId,
          ativa: true
        }
      });

      const trabalhosParaCorrigir = await Trabalho.count({
        where: { 
          '$Atividade.id_professor$': userId,
          status: 'Entregue'
        },
        include: [{
          model: Atividade,
          attributes: []
        }]
      });

      // Aulas da semana
      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
      
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(fimSemana.getDate() + 6);

      const aulasSemana = await Aula.findAll({
        where: { 
          id_professor: userId,
          data_aula: { [Op.between]: [inicioSemana, fimSemana] }
        },
        include: [{
          model: Turma,
          attributes: ['nome', 'codigo']
        }, {
          model: Disciplina,
          attributes: ['nome', 'codigo']
        }],
        order: [['data_aula', 'ASC'], ['hora_inicio', 'ASC']]
      });

      // Agendamentos do dia
      const agendamentosHoje = await Agendamento.findAll({
        where: { 
          id_professor: userId,
          data_agendamento: new Date(),
          status: { [Op.in]: ['Agendado', 'Confirmado'] }
        },
        include: [{
          model: Sala,
          attributes: ['nome', 'codigo']
        }],
        order: [['hora_inicio', 'ASC']]
      });

      const dashboard = {
        professor: {
          id: professor.id_professor,
          nome: professor.nome,
          foto_url: professor.foto_url,
          especialidade: professor.especialidade
        },
        estatisticas: {
          total_turmas: totalTurmas,
          total_alunos: totalAlunos,
          total_atividades: atividades,
          trabalhos_para_corrigir: trabalhosParaCorrigir
        },
        aulas_semana: aulasSemana,
        agendamentos_hoje: agendamentosHoje
      };

      res.json(dashboard);
    } catch (error) {
      console.error('Erro no dashboard professor:', error);
      res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
  },

  async getDashboardAdmin(req, res) {
    try {
      // Estatísticas gerais
      const totalAlunos = await Aluno.count({
        where: { status: 'Ativo' }
      });

      const totalProfessores = await Professor.count({
        where: { ativo: 'Ativo' }
      });

      const totalTurmas = await Turma.count({
        where: { ativo: true }
      });

      const totalCursos = await Curso.count({
        where: { ativo: true }
      });

      // Atividades recentes
      const atividadesRecentes = await Atividade.count({
        where: {
          criado_em: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }
      });

      // Posts recentes
      const postsRecentes = await Post.count({
        where: {
          criado_em: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }
      });

      // Usuários ativos
      const usuariosAtivos = await User.count({
        where: { 
          ativo: true,
          ultimo_login: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }
      });

      // Distribuição por tipo de usuário
      const usuariosPorTipo = await User.findAll({
        attributes: [
          'tipo',
          [Sequelize.fn('COUNT', Sequelize.col('id_usuario')), 'quantidade']
        ],
        where: { ativo: true },
        group: ['tipo']
      });

      const dashboard = {
        estatisticas_gerais: {
          total_alunos,
          total_professores,
          total_turmas,
          total_cursos,
          atividades_recentes: atividadesRecentes,
          posts_recentes: postsRecentes,
          usuarios_ativos: usuariosAtivos
        },
        usuarios_por_tipo: usuariosPorTipo.reduce((acc, u) => {
          acc[u.tipo] = parseInt(u.get('quantidade'));
          return acc;
        }, {}),
        alertas: {
          turmas_lotadas: await this.getTurmasLotadas(),
          recursos_baixos: await this.getRecursosBaixos(),
          atividades_atrasadas: await this.getAtividadesAtrasadas()
        }
      };

      res.json(dashboard);
    } catch (error) {
      console.error('Erro no dashboard admin:', error);
      res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
  },

  async getTurmasLotadas() {
    const turmas = await Turma.findAll({
      include: [{
        model: Matricula,
        where: { status: 'Ativa' },
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('id_matricula')), 'total_alunos']]
      }],
      having: Sequelize.literal('total_alunos >= capacidade_maxima * 0.9'),
      group: ['Turma.id_turma']
    });

    return turmas.length;
  },

  async getRecursosBaixos() {
    const recursos = await Recurso.count({
      where: {
        quantidade_disponivel: { [Op.lt]: Sequelize.col('quantidade_total') * 0.1 }
      }
    });

    return recursos;
  },

  async getAtividadesAtrasadas() {
    const atividades = await Atividade.count({
      where: {
        data_entrega: { [Op.lt]: new Date() },
        ativa: true
      }
    });

    return atividades;
  }
};

module.exports = dashboardController;