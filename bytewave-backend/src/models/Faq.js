const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Faq = sequelize.define('Faq', {
    id_faq: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pergunta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resposta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    categoria: DataTypes.STRING(50),
    ordem: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    visualizacoes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    util: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    inutil: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'faq',
    timestamps: true,
    createdAt: 'criado_em'
  });

  return Faq;
};