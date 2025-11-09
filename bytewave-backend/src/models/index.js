const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

// Carregar todos os modelos automaticamente
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js' &&
      file !== 'index.js' // Excluir o próprio arquivo
    );
  })
  .forEach(file => {
    try {
      const modelPath = path.join(__dirname, file);
      const modelModule = require(modelPath);
      
      // Verificar se o módulo exporta uma função
      if (typeof modelModule === 'function') {
        const model = modelModule(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      } else {
        console.warn(`Arquivo ${file} não exporta uma função válida`);
      }
    } catch (error) {
      console.error(`Erro ao carregar modelo ${file}:`, error.message);
    }
  });

// Configurar associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (error) {
      console.error(`Erro na associação do modelo ${modelName}:`, error.message);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;