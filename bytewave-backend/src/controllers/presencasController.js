const { Presenca, Aula, Aluno, JustificativaFalta, User } = require('../models');
const { Op } = require('sequelize');

const presencasController = {
  async getPresencas(req, res) {
    try {
      const { page = 1, limit = 50, aluno, aula, status, data_inicio, data_fim } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (aluno) where.id_aluno = aluno;
      if (aula) where.id_aula = aula;
      if (status) where.status = status;

      if (data_inicio && data_fim) {
        where['$Aula.data_aula$'] = {
          [Op.between]: [new Date(data_inicio), new Date(data_fim)]
        };
      }

      const presencas = await Presenca.findAndCountAll({
        where,
        include: [
          {
            model: Aula,
            attributes: ['id_aula', 'data_aula', 'hora_inicio', 'hora_fim'],
            include: [{
              model: Disciplina,
              attributes: ['nome', 'codigo']
            }]
          },
          {
            model: Aluno,
            attributes: ['id_aluno', 'nome', 'foto_url']
          },
          {
            model: JustificativaFalta,
            required: false
          }
        ],
        order: [[Aula, 'data_aula', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        presencas: presencas.rows,
        total: presencas.count,
        page: parseInt(page),
        totalPages: Math.ceil(presencas.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar presenças' });
    }
  },

  async getPresencaAluno(req, res) {
    try {
      const { alunoId } = req.params;
      const { mes, ano } = req.query;

      const where = { id_aluno: alunoId };
      
      if (mes && ano) {
        const dataInicio = new Date(ano, mes - 1, 1);
        const dataFim = new Date(ano, mes, 0);
        
        where['$Aula.data_aula$'] = {
          [Op.between]: [dataInicio, dataFim]
        };
      }

      const presencas = await Presenca.findAll({
        where,
        include: [
          {
            model: Aula,
            attributes: ['id_aula', 'data_aula', 'hora_inicio', 'hora_fim'],
            include: [{
              model: Disciplina,
              attributes: ['nome', 'codigo']
            }]
          }
        ],
        order: [[Aula, 'data_aula', 'ASC']]
      });

      // Calcular estatísticas
      const total = presencas.length;
      const presentes = presencas.filter(p => p.status === 'Presente').length;
      const faltas = presencas.filter(p => p.status === 'Falta').length;
      const faltasJustificadas = presencas.filter(p => p.status === 'FaltaJustificada').length;
      const atrasos = presencas.filter(p => p.status === 'Atraso').length;

      const estatisticas = {
        total,
        presentes,
        faltas,
        faltasJustificadas,
        atrasos,
        percentualPresenca: total > 0 ? Math.round((presentes / total) * 100) : 0
      };

      res.json({
        presencas,
        estatisticas
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar presenças do aluno' });
    }
  },

  async justificarFalta(req, res) {
    try {
      const { id } = req.params;
      const { tipo, descricao } = req.body;

      const presenca = await Presenca.findByPk(id);
      if (!presenca) {
        return res.status(404).json({ error: 'Registro de presença não encontrado' });
      }

      // Verificar se o aluno é o dono da presença
      if (presenca.id_aluno !== req.userId && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para justificar esta falta' });
      }

      const justificativa = await JustificativaFalta.create({
        id_presenca: id,
        id_aluno: presenca.id_aluno,
        tipo: tipo || 'Outros',
        descricao,
        status: 'Pendente'
      });

      // Atualizar status da presença
      await presenca.update({ status: 'FaltaJustificada' });

      res.status(201).json({
        message: 'Falta justificada com sucesso',
        justificativa
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao justificar falta' });
    }
  },

  async avaliarJustificativa(req, res) {
    try {
      const { id } = req.params;
      const { status, resposta } = req.body;

      const justificativa = await JustificativaFalta.findByPk(id);
      if (!justificativa) {
        return res.status(404).json({ error: 'Justificativa não encontrada' });
      }

      // Apenas professores e admin podem avaliar justificativas
      if (req.userType !== 'professor' && req.userType !== 'admin') {
        return res.status(403).json({ error: 'Sem permissão para avaliar justificativas' });
      }

      await justificativa.update({
        status,
        resposta,
        avaliado_por: req.userId
      });

      // Se justificativa rejeitada, voltar status para Falta
      if (status === 'Rejeitada') {
        await Presenca.update(
          { status: 'Falta' },
          { where: { id_presenca: justificativa.id_presenca } }
        );
      }

      res.json({
        message: `Justificativa ${status.toLowerCase()} com sucesso`,
        justificativa
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao avaliar justificativa' });
    }
  },

  async getJustificativasPendentes(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const justificativas = await JustificativaFalta.findAndCountAll({
        where: { status: 'Pendente' },
        include: [
          {
            model: Presenca,
            include: [
              {
                model: Aula,
                include: [{
                  model: Disciplina,
                  attributes: ['nome', 'codigo']
                }]
              },
              {
                model: Aluno,
                attributes: ['id_aluno', 'nome', 'foto_url']
              }
            ]
          }
        ],
        order: [['criado_em', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      res.json({
        justificativas: justificativas.rows,
        total: justificativas.count,
        page: parseInt(page),
        totalPages: Math.ceil(justificativas.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar justificativas pendentes' });
    }
  }
};

module.exports = presencasController;