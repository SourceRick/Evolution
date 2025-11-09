const { 
  Aluno, Professor, Turma, Curso, Atividade, Trabalho, 
  Presenca, Aula, Matricula, User 
} = require('../models');
const { Op, Sequelize } = require('sequelize');

const relatoriosController = {
  async getRelatorioAlunos(req, res) {
    try {
      const { curso, turma, status, data_inicio, data_fim } = req.query;

      const where = {};
      if (status) where.status = status;

      const include = [{
        model: Matricula,
        where: {},
        include: [{
          model: Turma,
          where: {},
          include: [{
            model: Curso,
            where: curso ? { id_curso: curso } : {}
          }]
        }]
      }];

      if (turma) include[0].where.id_turma = turma;

      const alunos = await Aluno.findAll({
        where,
        include,
        order: [['nome', 'ASC']]
      });

      // Estatísticas
      const totalAlunos = alunos.length;
      const alunosAtivos = alunos.filter(a => a.status === 'Ativo').length;
      const alunosConcluidos = alunos.filter(a => a.status === 'Concluido').length;

      const relatorio = {
        periodo: {
          data_inicio: data_inicio || 'N/A',
          data_fim: data_fim || 'N/A'
        },
        filtros: {
          curso: curso || 'Todos',
          turma: turma || 'Todas',
          status: status || 'Todos'
        },
        estatisticas: {
          total_alunos: totalAlunos,
          alunos_ativos: alunosAtivos,
          alunos_concluidos: alunosConcluidos,
          percentual_ativos: totalAlunos > 0 ? Math.round((alunosAtivos / totalAlunos) * 100) : 0
        },
        dados: alunos.map(aluno => ({
          id: aluno.id_aluno,
          nome: aluno.nome,
          email: aluno.email,
          status: aluno.status,
          turmas: aluno.Matriculas.map(m => ({
            nome: m.Turma.nome,
            curso: m.Turma.Curso.nome
          }))
        }))
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar relatório de alunos' });
    }
  },

  async getRelatorioNotas(req, res) {
    try {
      const { turma, disciplina, data_inicio, data_fim } = req.query;

      const where = {
        status: 'Avaliado'
      };

      if (data_inicio && data_fim) {
        where.data_avaliacao = {
          [Op.between]: [new Date(data_inicio), new Date(data_fim)]
        };
      }

      const trabalhos = await Trabalho.findAll({
        where,
        include: [
          {
            model: Atividade,
            where: {
              ...(disciplina && { id_disciplina: disciplina })
            },
            include: [{
              model: Turma,
              where: {
                ...(turma && { id_turma: turma })
              },
              include: [{
                model: Curso,
                attributes: ['nome']
              }]
            }]
          },
          {
            model: Aluno,
            attributes: ['id_aluno', 'nome']
          }
        ],
        order: [[Atividade, 'data_entrega', 'DESC']]
      });

      // Calcular estatísticas
      const notas = trabalhos.map(t => t.nota).filter(n => n !== null);
      const mediaGeral = notas.length > 0 ? 
        notas.reduce((a, b) => a + b, 0) / notas.length : 0;

      const estatisticas = {
        total_trabalhos: trabalhos.length,
        trabalhos_avaliados: notas.length,
        media_geral: Math.round(mediaGeral * 100) / 100,
        maior_nota: notas.length > 0 ? Math.max(...notas) : 0,
        menor_nota: notas.length > 0 ? Math.min(...notas) : 0
      };

      // Agrupar por turma
      const porTurma = trabalhos.reduce((acc, trabalho) => {
        const turmaNome = trabalho.Atividade.Turma.nome;
        if (!acc[turmaNome]) {
          acc[turmaNome] = {
            trabalhos: [],
            notas: []
          };
        }
        acc[turmaNome].trabalhos.push(trabalho);
        if (trabalho.nota) {
          acc[turmaNome].notas.push(trabalho.nota);
        }
        return acc;
      }, {});

      // Calcular médias por turma
      Object.keys(porTurma).forEach(turmaNome => {
        const notasTurma = porTurma[turmaNome].notas;
        porTurma[turmaNome].media = notasTurma.length > 0 ?
          Math.round((notasTurma.reduce((a, b) => a + b, 0) / notasTurma.length) * 100) / 100 : 0;
      });

      const relatorio = {
        periodo: {
          data_inicio: data_inicio || 'N/A',
          data_fim: data_fim || 'N/A'
        },
        estatisticas,
        por_turma: porTurma,
        dados: trabalhos.map(trabalho => ({
          id_trabalho: trabalho.id_trabalho,
          aluno: trabalho.Aluno.nome,
          atividade: trabalho.Atividade.titulo,
          turma: trabalho.Atividade.Turma.nome,
          curso: trabalho.Atividade.Turma.Curso.nome,
          nota: trabalho.nota,
          data_avaliacao: trabalho.data_avaliacao
        }))
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar relatório de notas' });
    }
  },

  async getRelatorioPresencas(req, res) {
    try {
      const { turma, data_inicio, data_fim } = req.query;

      if (!data_inicio || !data_fim) {
        return res.status(400).json({ error: 'Data início e data fim são obrigatórias' });
      }

      const presencas = await Presenca.findAll({
        where: {
          '$Aula.data_aula$': {
            [Op.between]: [new Date(data_inicio), new Date(data_fim)]
          },
          ...(turma && { '$Aula.id_turma$': turma })
        },
        include: [
          {
            model: Aula,
            include: [
              {
                model: Turma,
                include: [{
                  model: Curso,
                  attributes: ['nome']
                }]
              },
              {
                model: Disciplina,
                attributes: ['nome', 'codigo']
              }
            ]
          },
          {
            model: Aluno,
            attributes: ['id_aluno', 'nome']
          }
        ],
        order: [[Aula, 'data_aula', 'ASC']]
      });

      // Agrupar por aluno
      const porAluno = presencas.reduce((acc, presenca) => {
        const alunoId = presenca.id_aluno;
        if (!acc[alunoId]) {
          acc[alunoId] = {
            aluno: presenca.Aluno,
            presencas: [],
            estatisticas: {
              total: 0,
              presentes: 0,
              faltas: 0,
              faltas_justificadas: 0,
              atrasos: 0
            }
          };
        }

        acc[alunoId].presencas.push(presenca);
        acc[alunoId].estatisticas.total++;
        
        switch (presenca.status) {
          case 'Presente':
            acc[alunoId].estatisticas.presentes++;
            break;
          case 'Falta':
            acc[alunoId].estatisticas.faltas++;
            break;
          case 'FaltaJustificada':
            acc[alunoId].estatisticas.faltas_justificadas++;
            break;
          case 'Atraso':
            acc[alunoId].estatisticas.atrasos++;
            break;
        }

        return acc;
      }, {});

      // Calcular percentuais
      Object.values(porAluno).forEach(alunoData => {
        const stats = alunoData.estatisticas;
        stats.percentual_presenca = stats.total > 0 ?
          Math.round((stats.presentes / stats.total) * 100) : 0;
      });

      // Estatísticas gerais
      const totalRegistros = presencas.length;
      const totalPresentes = presencas.filter(p => p.status === 'Presente').length;
      const totalFaltas = presencas.filter(p => p.status === 'Falta').length;

      const estatisticasGerais = {
        total_registros: totalRegistros,
        total_presentes: totalPresentes,
        total_faltas: totalFaltas,
        percentual_presenca_geral: totalRegistros > 0 ?
          Math.round((totalPresentes / totalRegistros) * 100) : 0
      };

      const relatorio = {
        periodo: {
          data_inicio,
          data_fim
        },
        estatisticas_gerais,
        por_aluno: Object.values(porAluno).map(data => ({
          aluno: data.aluno,
          estatisticas: data.estatisticas
        })),
        detalhamento: presencas.map(presenca => ({
          data: presenca.Aula.data_aula,
          aluno: presenca.Aluno.nome,
          disciplina: presenca.Aula.Disciplina.nome,
          turma: presenca.Aula.Turma.nome,
          status: presenca.status,
          observacoes: presenca.observacoes
        }))
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar relatório de presenças' });
    }
  },

  async getRelatorioAtividades(req, res) {
    try {
      const { turma, disciplina, tipo, data_inicio, data_fim } = req.query;

      const where = {
        ativa: true
      };

      if (tipo) where.tipo = tipo;
      if (disciplina) where.id_disciplina = disciplina;

      if (data_inicio && data_fim) {
        where.data_entrega = {
          [Op.between]: [new Date(data_inicio), new Date(data_fim)]
        };
      }

      const atividades = await Atividade.findAll({
        where,
        include: [
          {
            model: Turma,
            where: turma ? { id_turma: turma } : {},
            include: [{
              model: Curso,
              attributes: ['nome']
            }]
          },
          {
            model: Disciplina,
            attributes: ['nome', 'codigo']
          },
          {
            model: Professor,
            attributes: ['nome', 'foto_url']
          },
          {
            model: Trabalho,
            attributes: ['id_trabalho', 'status', 'nota']
          }
        ],
        order: [['data_entrega', 'DESC']]
      });

      // Estatísticas
      const estatisticas = {
        total_atividades: atividades.length,
        por_tipo: atividades.reduce((acc, atividade) => {
          acc[atividade.tipo] = (acc[atividade.tipo] || 0) + 1;
          return acc;
        }, {}),
        entregas: {
          total: atividades.reduce((acc, atividade) => acc + atividade.Trabalhos.length, 0),
          avaliadas: atividades.reduce((acc, atividade) => 
            acc + atividade.Trabalhos.filter(t => t.status === 'Avaliado').length, 0
          ),
          pendentes: atividades.reduce((acc, atividade) => 
            acc + atividade.Trabalhos.filter(t => t.status === 'Entregue').length, 0
          )
        }
      };

      const relatorio = {
        periodo: {
          data_inicio: data_inicio || 'N/A',
          data_fim: data_fim || 'N/A'
        },
        estatisticas,
        atividades: atividades.map(atividade => ({
          id: atividade.id_atividade,
          titulo: atividade.titulo,
          tipo: atividade.tipo,
          disciplina: atividade.Disciplina.nome,
          turma: atividade.Turma.nome,
          curso: atividade.Turma.Curso.nome,
          data_entrega: atividade.data_entrega,
          professor: atividade.Professor.nome,
          total_trabalhos: atividade.Trabalhos.length,
          trabalhos_avaliados: atividade.Trabalhos.filter(t => t.status === 'Avaliado').length,
          media_notas: atividade.Trabalhos.filter(t => t.nota).length > 0 ?
            Math.round(atividade.Trabalhos.reduce((acc, t) => acc + (t.nota || 0), 0) / 
            atividade.Trabalhos.filter(t => t.nota).length * 100) / 100 : null
        }))
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar relatório de atividades' });
    }
  },

  async getRelatorioFinanceiro(req, res) {
    try {
      // Este é um exemplo básico - você pode integrar com um sistema financeiro real
      const { mes, ano } = req.query;

      const mesAtual = mes || new Date().getMonth() + 1;
      const anoAtual = ano || new Date().getFullYear();

      // Simulação de dados financeiros
      const relatorio = {
        periodo: {
          mes: mesAtual,
          ano: anoAtual,
          descricao: `${mesAtual}/${anoAtual}`
        },
        receitas: {
          mensalidades: 15000.00,
          matriculas: 5000.00,
          outros: 2000.00,
          total: 22000.00
        },
        despesas: {
          salarios: 12000.00,
          infraestrutura: 3000.00,
          materiais: 1500.00,
          outros: 1000.00,
          total: 17500.00
        },
        resumo: {
          saldo: 4500.00,
          lucratividade: '20.45%'
        },
        metricas: {
          alunos_ativos: await Aluno.count({ where: { status: 'Ativo' } }),
          inadimplencia: '5.2%',
          custo_por_aluno: 350.00
        }
      };

      res.json(relatorio);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar relatório financeiro' });
    }
  }
};

module.exports = relatoriosController;