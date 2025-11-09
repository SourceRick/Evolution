const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PerfilUsuario = sequelize.define('PerfilUsuario', {
    id_perfil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    bio: DataTypes.TEXT,
    website: DataTypes.STRING(200),
    linkedin_url: DataTypes.STRING(200),
    github_url: DataTypes.STRING(200),
    interesses: DataTypes.JSON,
    configuracoes: DataTypes.JSON
  }, {
    tableName: 'perfil_usuario'
  });

  PerfilUsuario.associate = function(models) {
    PerfilUsuario.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return PerfilUsuario;
};