const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Presenca = sequelize.define('Presenca', {
    id_presenca: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_aula: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_aluno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Presente', 'Falta', 'FaltaJustificada', 'Atraso'),
      defaultValue: 'Presente'
    },
    observacoes: DataTypes.TEXT,
    registrado_por: DataTypes.INTEGER
  }, {
    tableName: 'presenca',
    timestamps: true,
    createdAt: 'registrado_em'
  });

  Presenca.associate = function(models) {
    Presenca.belongsTo(models.Aula, { foreignKey: 'id_aula' });
    Presenca.belongsTo(models.Aluno, { foreignKey: 'id_aluno' });
    Presenca.belongsTo(models.User, { foreignKey: 'registrado_por', as: 'registrador' });
    Presenca.hasOne(models.JustificativaFalta, { foreignKey: 'id_presenca' });
  };

  return Presenca;
};