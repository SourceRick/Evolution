const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

// Importar database e modelos
require('./config/database');
require('./models');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Log de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api', require('./routes'));

// Health check global
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ByteWave Backend está funcionando!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo ao ByteWave API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/health',
      auth: '/api/auth',
      posts: '/api/posts',
      dashboard: '/api/dashboard'
    },
    documentation: 'Em desenvolvimento'
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
🚀 BYTEWAVE BACKEND INICIADO!
📍 Porta: ${PORT}
🌐 Ambiente: ${process.env.NODE_ENV}
📊 Health: http://localhost:${PORT}/health
🔗 API: http://localhost:${PORT}/api/health
🔐 Auth: http://localhost:${PORT}/api/auth
📝 Posts: http://localhost:${PORT}/api/posts
📈 Dashboard: http://localhost:${PORT}/api/dashboard
🕐 ${new Date().toLocaleString('pt-BR')}
  `);
});

module.exports = app;