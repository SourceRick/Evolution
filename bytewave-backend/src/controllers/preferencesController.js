const { PreferenciaAcessibilidade } = require('../models');

const preferencesController = {
  async getPreferences(req, res) {
    try {
      let preferences = await PreferenciaAcessibilidade.findOne({
        where: { id_usuario: req.userId }
      });

      // Se não existir, criar padrão
      if (!preferences) {
        preferences = await PreferenciaAcessibilidade.create({
          id_usuario: req.userId
        });
      }

      res.json(preferences);
    } catch (error) {
      console.error('Erro ao buscar preferências:', error);
      res.status(500).json({ error: 'Erro ao buscar preferências' });
    }
  },

  async updatePreferences(req, res) {
    try {
      const {
        tema,
        alto_contraste,
        tamanho_fonte,
        fonte_legivel,
        espacamento_texto,
        navegacao_teclado,
        legendas,
        comando_voz,
        leitor_tela,
        velocidade_leitura
      } = req.body;

      const [preferences, created] = await PreferenciaAcessibilidade.upsert({
        id_usuario: req.userId,
        tema: tema || 'auto',
        alto_contraste: alto_contraste || false,
        tamanho_fonte: tamanho_fonte || 'medio',
        fonte_legivel: fonte_legivel || false,
        espacamento_texto: espacamento_texto || 1.5,
        navegacao_teclado: navegacao_teclado !== false,
        legendas: legendas !== false,
        comando_voz: comando_voz || false,
        leitor_tela: leitor_tela || false,
        velocidade_leitura: velocidade_leitura || 'normal'
      }, {
        returning: true
      });

      res.json({
        message: 'Preferências atualizadas com sucesso',
        preferences
      });
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      res.status(500).json({ error: 'Erro ao atualizar preferências' });
    }
  }
};

module.exports = preferencesController;