const db = require('./models');

console.log('=== MODELOS CARREGADOS ===');
Object.keys(db).forEach(modelName => {
  if (modelName !== 'sequelize' && modelName !== 'Sequelize') {
    console.log(`✅ ${modelName}`);
  }
});
console.log('==========================');

// Testar conexão com o banco
db.sequelize.authenticate()
  .then(() => console.log('✅ Conexão com MySQL estabelecida com sucesso!'))
  .catch(error => console.error('❌ Erro na conexão:', error.message));