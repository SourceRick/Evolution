const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    senha_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('admin', 'professor', 'aluno', 'moderador'),
      allowNull: false
    },
    id_professor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_aluno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email_verificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ultimo_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'usuario',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    hooks: {
      beforeCreate: async (user) => {
        if (user.senha_hash) {
          user.senha_hash = await bcrypt.hash(user.senha_hash, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('senha_hash')) {
          user.senha_hash = await bcrypt.hash(user.senha_hash, 12);
        }
      }
    }
  });

  User.prototype.validarSenha = function(senha) {
    return bcrypt.compare(senha, this.senha_hash);
  };

  User.associate = function(models) {
    User.belongsTo(models.Professor, { foreignKey: 'id_professor' });
    User.belongsTo(models.Aluno, { foreignKey: 'id_aluno' });
    User.hasOne(models.PreferenciaAcessibilidade, { foreignKey: 'id_usuario' });
    User.hasMany(models.Post, { foreignKey: 'id_autor' });
    User.hasMany(models.Sessao, { foreignKey: 'id_usuario' });
  };

  return User;
};