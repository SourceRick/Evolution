const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LogAuditoria = sequelize.define('LogAuditoria', {
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: DataTypes.INTEGER,
    acao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    modulo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    entidade: DataTypes.STRING(50),
    id_entidade: DataTypes.INTEGER,
    valores_antigos: DataTypes.JSON,
    valores_novos: DataTypes.JSON,
    ip_address: DataTypes.STRING(45),
    user_agent: DataTypes.TEXT
  }, {
    tableName: 'log_auditoria',
    timestamps: true,
    createdAt: 'criado_em'
  });

  LogAuditoria.associate = function(models) {
    LogAuditoria.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return LogAuditoria;
};