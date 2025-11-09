const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Instituicao = sequelize.define('Instituicao', {
    id_instituicao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(14),
      unique: true
    },
    logo_url: DataTypes.STRING(500),
    endereco: DataTypes.TEXT,
    telefone: DataTypes.STRING(20),
    email: DataTypes.STRING(150),
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'instituicao',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Instituicao.associate = function(models) {
    Instituicao.hasMany(models.Departamento, { foreignKey: 'id_instituicao' });
  };

  return Instituicao;
};