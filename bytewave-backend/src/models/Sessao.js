const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sessao = sequelize.define('Sessao', {
    id_sessao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    refresh_token: DataTypes.STRING(500),
    expira_em: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dispositivo: DataTypes.STRING(200),
    ip_address: DataTypes.STRING(45),
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'sessao',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Sessao.associate = function(models) {
    Sessao.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return Sessao;
};