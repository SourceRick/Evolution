const { ConfiguracaoSistema, AtalhoAcessibilidade, Faq } = require('../models');

const configuracoesController = {
  async getConfiguracoes(req, res) {
    try {
      const { categoria } = req.query;

      const where = {};
      if (categoria) where.categoria = categoria;

      const configuracoes = await ConfiguracaoSistema.findAll({
        where,
        order: [['categoria', 'ASC'], ['chave', 'ASC']]
      });

      res.json(configuracoes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  },

  async getConfiguracaoByChave(req, res) {
    try {
      const { chave } = req.params;

      const configuracao = await ConfiguracaoSistema.findOne({
        where: { chave }
      });

      if (!configuracao) {
        return res.status(404).json({ error: 'Configuração não encontrada' });
      }

      res.json(configuracao);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar configuração' });
    }
  },

  async updateConfiguracao(req, res) {
    try {
      const { chave } = req.params;
      const { valor } = req.body;

      const configuracao = await ConfiguracaoSistema.findOne({
        where: { chave }
      });

      if (!configuracao) {
        return res.status(404).json({ error: 'Configuração não encontrada' });
      }

      if (!configuracao.editavel) {
        return res.status(403).json({ error: 'Esta configuração não pode ser editada' });
      }

      await configuracao.update({ valor });

      res.json({ 
        message: 'Configuração atualizada com sucesso',
        configuracao 
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar configuração' });
    }
  },

  async getAtalhosAcessibilidade(req, res) {
    try {
      const { categoria, ativo } = req.query;

      const where = {};
      if (categoria) where.categoria = categoria;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const atalhos = await AtalhoAcessibilidade.findAll({
        where,
        order: [['categoria', 'ASC'], ['tecla', 'ASC']]
      });

      res.json(atalhos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar atalhos de acessibilidade' });
    }
  },

  async updateAtalhoAcessibilidade(req, res) {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      const atalho = await AtalhoAcessibilidade.findByPk(id);
      if (!atalho) {
        return res.status(404).json({ error: 'Atalho não encontrado' });
      }

      await atalho.update({ ativo });

      res.json({ 
        message: 'Atalho atualizado com sucesso',
        atalho 
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar atalho' });
    }
  },

  async getFaqs(req, res) {
    try {
      const { categoria, ativo } = req.query;

      const where = {};
      if (categoria) where.categoria = categoria;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const faqs = await Faq.findAll({
        where,
        order: [['categoria', 'ASC'], ['ordem', 'ASC'], ['visualizacoes', 'DESC']]
      });

      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar FAQs' });
    }
  },

  async getFaqById(req, res) {
    try {
      const { id } = req.params;

      const faq = await Faq.findByPk(id);
      if (!faq) {
        return res.status(404).json({ error: 'FAQ não encontrada' });
      }

      // Incrementar visualizações
      await faq.increment('visualizacoes');

      res.json(faq);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar FAQ' });
    }
  },

  async createFaq(req, res) {
    try {
      const { pergunta, resposta, categoria, ordem } = req.body;

      const faq = await Faq.create({
        pergunta,
        resposta,
        categoria: categoria || 'Geral',
        ordem: ordem || 1
      });

      res.status(201).json({
        message: 'FAQ criada com sucesso',
        faq
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar FAQ' });
    }
  },

  async updateFaq(req, res) {
    try {
      const { id } = req.params;
      const { pergunta, resposta, categoria, ordem, ativo } = req.body;

      const faq = await Faq.findByPk(id);
      if (!faq) {
        return res.status(404).json({ error: 'FAQ não encontrada' });
      }

      await faq.update({
        pergunta,
        resposta,
        categoria,
        ordem,
        ativo
      });

      res.json({ 
        message: 'FAQ atualizada com sucesso',
        faq 
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar FAQ' });
    }
  },

  async avaliarFaq(req, res) {
    try {
      const { id } = req.params;
      const { util } = req.body; // true para útil, false para inútil

      const faq = await Faq.findByPk(id);
      if (!faq) {
        return res.status(404).json({ error: 'FAQ não encontrada' });
      }

      if (util) {
        await faq.increment('util');
      } else {
        await faq.increment('inutil');
      }

      res.json({ 
        message: `Avaliação ${util ? 'positiva' : 'negativa'} registrada com sucesso`,
        faq: {
          util: faq.util,
          inutil: faq.inutil
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao avaliar FAQ' });
    }
  },

  async getEstatisticasSistema(req, res) {
    try {
      const estatisticas = {
        usuarios: {
          total: await User.count(),
          ativos: await User.count({ where: { ativo: true } }),
          por_tipo: await User.findAll({
            attributes: [
              'tipo',
              [sequelize.fn('COUNT', sequelize.col('id_usuario')), 'quantidade']
            ],
            group: ['tipo']
          })
        },
        conteudo: {
          posts: await Post.count(),
          atividades: await Atividade.count(),
          trabalhos: await Trabalho.count(),
          aulas: await Aula.count()
        },
        desempenho: {
          taxa_presenca: await this.calcularTaxaPresenca(),
          media_notas: await this.calcularMediaNotas(),
          atividades_entregues: await this.calcularTaxaEntrega()
        }
      };

      res.json(estatisticas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar estatísticas do sistema' });
    }
  },

  // Métodos auxiliares para estatísticas
  async calcularTaxaPresenca() {
    const totalPresencas = await Presenca.count();
    const presentes = await Presenca.count({ where: { status: 'Presente' } });
    
    return totalPresencas > 0 ? Math.round((presentes / totalPresencas) * 100) : 0;
  },

  async calcularMediaNotas() {
    const trabalhos = await Trabalho.findAll({
      where: { nota: { [Op.not]: null } },
      attributes: [[sequelize.fn('AVG', sequelize.col('nota')), 'media']]
    });

    return trabalhos[0] ? Math.round(trabalhos[0].get('media') * 100) / 100 : 0;
  },

  async calcularTaxaEntrega() {
    const atividades = await Atividade.count({ where: { ativa: true } });
    const trabalhos = await Trabalho.count({ where: { status: 'Entregue' } });
    
    return atividades > 0 ? Math.round((trabalhos / atividades) * 100) : 0;
  }
};

module.exports = configuracoesController;