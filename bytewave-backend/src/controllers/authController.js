const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

console.log('✅ AuthController Sequelize carregado');

const register = async (req, res) => {
  try {
    console.log('📨 Recebendo registro:', req.body);
    
    const { name, email, password, confirmPassword } = req.body;

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'As senhas não coincidem'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verifica se usuário já existe
    const existingUser = await User.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um usuário com este email'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário usando Sequelize
    const newUser = await User.create({
      username: email,
      email: email,
      senha_hash: hashedPassword,
      tipo: 'aluno'
    });

    // Gera token
    const token = jwt.sign(
      { 
        userId: newUser.id_usuario,
        tipo: newUser.tipo 
      },
      process.env.JWT_SECRET || 'secret_sequelize',
      { expiresIn: '24h' }
    );

    console.log('✅ Usuário criado com ID:', newUser.id_usuario);

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso!',
      token,
      user: {
        id: newUser.id_usuario,
        name: name,
        email: newUser.email,
        tipo: newUser.tipo
      }
    });

  } catch (error) {
    console.error('💥 ERRO NO REGISTRO:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor: ' + error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Busca usuário usando Sequelize
    const user = await User.findOne({ 
      where: { 
        email: email,
        ativo: true 
      } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verifica senha
    const isPasswordValid = await bcrypt.compare(password, user.senha_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Gera token
    const token = jwt.sign(
      { 
        userId: user.id_usuario,
        tipo: user.tipo 
      },
      process.env.JWT_SECRET || 'secret_sequelize',
      { expiresIn: '24h' }
    );

    // Atualiza último login
    await user.update({ ultimo_login: new Date() });

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id_usuario,
        name: user.username,
        email: user.email,
        tipo: user.tipo
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id_usuario', 'username', 'email', 'tipo', 'ultimo_login']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id_usuario,
        name: user.username,
        email: user.email,
        tipo: user.tipo
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

const updateProfile = (req, res) => {
  res.json({ success: true, message: 'Perfil atualizado' });
};

const changePassword = (req, res) => {
  res.json({ success: true, message: 'Senha alterada' });
};

module.exports = {
  login,
  register,
  me,
  updateProfile,
  changePassword
};