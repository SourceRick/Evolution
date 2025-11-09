const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BackupLog = sequelize.define('BackupLog', {
    id_backup: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.ENUM('Automatico', 'Manual', 'Exportacao'),
      defaultValue: 'Automatico'
    },
    descricao: DataTypes.STRING(200),
    arquivo_path: DataTypes.STRING(500),
    tamanho_bytes: DataTypes.BIGINT,
    status: {
      type: DataTypes.ENUM('Sucesso', 'Falha', 'Pendente'),
      defaultValue: 'Sucesso'
    },
    executado_por: DataTypes.INTEGER
  }, {
    tableName: 'backup_log',
    timestamps: true,
    createdAt: 'criado_em'
  });

  BackupLog.associate = function(models) {
    BackupLog.belongsTo(models.User, { foreignKey: 'executado_por' });
  };

  return BackupLog;
};