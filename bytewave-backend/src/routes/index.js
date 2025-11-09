const express = require('express');

// Importar todas as rotas
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const postsRoutes = require('./posts');
const commentsRoutes = require('./comments');
const reactionsRoutes = require('./reactions');
const coursesRoutes = require('./courses');
const turmasRoutes = require('./turmas');
const activitiesRoutes = require('./activities');
const trabalhosRoutes = require('./trabalhos');
const aulasRoutes = require('./aulas');
const presencasRoutes = require('./presencas');
const agendamentosRoutes = require('./agendamentos');
const recursosRoutes = require('./recursos');
const notificacoesRoutes = require('./notificacoes');
const mensagensRoutes = require('./mensagens');
const dashboardRoutes = require('./dashboard');
const relatoriosRoutes = require('./relatorios');
const configuracoesRoutes = require('./configuracoes');
const uploadRoutes = require('./upload');
const searchRoutes = require('./search');
const preferencesRoutes = require('./preferences');

const router = express.Router();

// Mapear todas as rotas
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/comments', commentsRoutes);
router.use('/reactions', reactionsRoutes);
router.use('/courses', coursesRoutes);
router.use('/turmas', turmasRoutes);
router.use('/activities', activitiesRoutes);
router.use('/trabalhos', trabalhosRoutes);
router.use('/aulas', aulasRoutes);
router.use('/presencas', presencasRoutes);
router.use('/agendamentos', agendamentosRoutes);
router.use('/recursos', recursosRoutes);
router.use('/notificacoes', notificacoesRoutes);
router.use('/mensagens', mensagensRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/relatorios', relatoriosRoutes);
router.use('/configuracoes', configuracoesRoutes);
router.use('/upload', uploadRoutes);
router.use('/search', searchRoutes);
router.use('/preferences', preferencesRoutes);

// Rota de health check da API
router.get('/health', (req, res) => {
  res.json({
    status: 'API Healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      courses: '/api/courses',
      turmas: '/api/turmas',
      activities: '/api/activities',
      dashboard: '/api/dashboard',
      upload: '/api/upload'
    }
  });
});

module.exports = router;