const jwt = require('jsonwebtoken');
const { User, Professor, Aluno, PreferenciaAcessibilidade, PerfilUsuario } = require('../models');

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const user = await User.findOne({
        where: { email },
        include: [
          { model: Professor, attributes: ['id_professor', 'nome', 'foto_url', 'especialidade'] },
          { model: Aluno, attributes: ['id_aluno', 'nome', 'foto_url', 'status'] },
          { model: PreferenciaAcessibilidade },
          { model: PerfilUsuario }
        ]
      });

      if (!user || !user.ativo) {
        return res.status(401).json({ error: 'Credenciais inválidas ou usuário inativo' });
      }

      const senhaValida = await user.validarSenha(senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { 
          userId: user.id_usuario, 
          tipo: user.tipo,
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      await user.update({ ultimo_login: new Date() });

      const userResponse = {
        id: user.id_usuario,
        email: user.email,
        username: user.username,
        tipo: user.tipo,
        nome: user.Professor?.nome || user.Aluno?.nome,
        foto_url: user.Professor?.foto_url || user.Aluno?.foto_url,
        preferencias: user.PreferenciaAcessibilidade,
        perfil: user.PerfilUsuario
      };

      res.json({
        token,
        user: userResponse,
        message: 'Login realizado com sucesso'
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async me(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['senha_hash'] },
        include: [
          { model: Professor, attributes: ['id_professor', 'nome', 'foto_url', 'especialidade', 'formacao'] },
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

  async updateProfile(req, res) {
    try {
      const { nome, telefone, bio, website, linkedin_url, github_url, interesses } = req.body;
      
      if (req.userType === 'professor') {
        await Professor.update(
          { nome, telefone },
          { where: { id_professor: req.userId } }
        );
      } else if (req.userType === 'aluno') {
        await Aluno.update(
          { nome, telefone },
          { where: { id_aluno: req.userId } }
        );
      }

      // Atualizar perfil
      await PerfilUsuario.upsert({
        id_usuario: req.userId,
        bio,
        website,
        linkedin_url,
        github_url,
        interesses: interesses ? JSON.parse(interesses) : null
      });

      res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  },

  async changePassword(req, res) {
    try {
      const { senha_atual, nova_senha } = req.body;

      const user = await User.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senhaValida = await user.validarSenha(senha_atual);
      if (!senhaValida) {
        return res.status(400).json({ error: 'Senha atual incorreta' });
      }

      await user.update({ senha_hash: nova_senha });

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao alterar senha' });
    }
  }
};

module.exports = authController;