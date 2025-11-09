const { User, Professor, Aluno, PreferenciaAcessibilidade, PerfilUsuario } = require('../models');

const usersController = {
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 20, tipo, ativo } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (tipo) where.tipo = tipo;
      if (ativo !== undefined) where.ativo = ativo === 'true';

      const users = await User.findAndCountAll({
        where,
        attributes: { exclude: ['senha_hash'] },
        include: [
          { model: Professor, attributes: ['nome', 'foto_url', 'especialidade'] },
          { model: Aluno, attributes: ['nome', 'foto_url', 'status'] }
        ],
        limit: parseInt(limit),
        offset: offset,
        order: [['criado_em', 'DESC']]
      });

      res.json({
        users: users.rows,
        total: users.count,
        page: parseInt(page),
        totalPages: Math.ceil(users.count / limit)
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: { exclude: ['senha_hash'] },
        include: [
          { model: Professor, attributes: ['id_professor', 'nome', 'foto_url', 'especialidade', 'formacao', 'lattes_url'] },
          { model: Aluno, attributes: ['id_aluno', 'nome', 'foto_url', 'status', 'data_nascimento'] },
          { model: PreferenciaAcessibilidade },
          { model: PerfilUsuario }
        ]
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  async createUser(req, res) {
    try {
      const { username, email, senha, tipo, id_professor, id_aluno } = req.body;

      const userExists = await User.findOne({ 
        where: { 
          [Op.or]: [{ email }, { username }] 
        } 
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email ou username já cadastrado' });
      }

      const user = await User.create({
        username,
        email,
        senha_hash: senha,
        tipo,
        id_professor: tipo === 'professor' ? id_professor : null,
        id_aluno: tipo === 'aluno' ? id_aluno : null
      });

      // Criar preferências padrão
      await PreferenciaAcessibilidade.create({
        id_usuario: user.id_usuario
      });

      res.status(201).json({ 
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id_usuario,
          username: user.username,
          email: user.email,
          tipo: user.tipo
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, tipo, ativo } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.update({
        username,
        email,
        tipo,
        ativo
      });

      res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.update({ ativo: false });

      res.json({ message: 'Usuário desativado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar usuário' });
    }
  }
};

module.exports = usersController;