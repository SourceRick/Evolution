const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se usuário ainda existe e está ativo
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id_usuario', 'tipo', 'ativo']
    });

    if (!user || !user.ativo) {
      return res.status(401).json({ error: 'Token inválido ou usuário inativo' });
    }

    req.userId = decoded.userId;
    req.userType = decoded.tipo;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userType)) {
      return res.status(403).json({ 
        error: 'Acesso negado. Permissão insuficiente.',
        required: roles,
        current: req.userType
      });
    }
    next();
  };
};

// Middleware para log de auditoria
const auditMiddleware = (modulo) => {
  return (req, res, next) => {
    const oldSend = res.send;
    
    res.send = function(data) {
      // Aqui você pode salvar no log_auditoria
      console.log(`[AUDIT] ${req.userId} - ${modulo} - ${req.method} ${req.path} - Status: ${res.statusCode}`);
      
      oldSend.apply(res, arguments);
    };
    
    next();
  };
};

module.exports = { 
  authMiddleware, 
  requireRole, 
  auditMiddleware 
};