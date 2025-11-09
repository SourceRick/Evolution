const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AgendamentoRecurso = sequelize.define('AgendamentoRecurso', {
    id_agendamento_recurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_agendamento: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_recurso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade_utilizada: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'agendamento_recurso'
  });

  AgendamentoRecurso.associate = function(models) {
    AgendamentoRecurso.belongsTo(models.Agendamento, { foreignKey: 'id_agendamento' });
    AgendamentoRecurso.belongsTo(models.Recurso, { foreignKey: 'id_recurso' });
  };

  return AgendamentoRecurso;
};