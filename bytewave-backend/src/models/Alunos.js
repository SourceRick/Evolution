const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Aluno = sequelize.define('Aluno', {
    id_aluno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(11),
      unique: true
    },
    data_nascimento: DataTypes.DATE,
    email: {
      type: DataTypes.STRING(150),
      unique: true
    },
    telefone: DataTypes.STRING(20),
    deficiencia: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tipo_deficiencia: DataTypes.STRING(100),
    necessidades_especiais: DataTypes.TEXT,
    foto_url: DataTypes.STRING(500),
    status: {
      type: DataTypes.ENUM('Ativo', 'Trancado', 'Concluido', 'Transferido'),
      defaultValue: 'Ativo'
    }
  }, {
    tableName: 'aluno',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Aluno.associate = function(models) {
    Aluno.hasMany(models.User, { foreignKey: 'id_aluno' });
    Aluno.hasMany(models.Matricula, { foreignKey: 'id_aluno' });
    Aluno.hasMany(models.Trabalho, { foreignKey: 'id_aluno' });
    Aluno.hasMany(models.Presenca, { foreignKey: 'id_aluno' });
  };

  return Aluno;
};