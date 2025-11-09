const sequelize = require('../config/database');

// Importar modelos
const User = require('./User');

// Associações (se necessário)
// User.associate = (models) => {
//   User.belongsTo(models.Aluno, { foreignKey: 'id_aluno' });
//   User.belongsTo(models.Professor, { foreignKey: 'id_professor' });
// };

const models = {
  User
};

// Sincronizar modelos (apenas em desenvolvimento)
async function syncModels() {
  try {
    await sequelize.sync({ alter: true }); // Use { force: true } apenas em desenvolvimento
    console.log('✅ Modelos sincronizados com o banco');
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error);
  }
}

syncModels();

module.exports = models;