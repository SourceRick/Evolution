const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PreferenciaAcessibilidade = sequelize.define('PreferenciaAcessibilidade', {
    id_preferencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    tema: {
      type: DataTypes.ENUM('claro', 'escuro', 'auto'),
      defaultValue: 'auto'
    },
    alto_contraste: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    escala_cinza: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    tamanho_fonte: {
      type: DataTypes.ENUM('pequeno', 'medio', 'grande', 'muito_grande'),
      defaultValue: 'medio'
    },
    fonte_legivel: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    espacamento_texto: {
      type: DataTypes.DECIMAL(3,1),
      defaultValue: 1.5
    },
    navegacao_teclado: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    pular_navegacao: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    legendas: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    descricao_audio: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    pausar_animacoes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    comando_voz: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    leitor_tela: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    velocidade_leitura: {
      type: DataTypes.ENUM('lenta', 'normal', 'rapida'),
      defaultValue: 'normal'
    }
  }, {
    tableName: 'preferencia_acessibilidade',
    timestamps: true,
    updatedAt: 'atualizado_em'
  });

  PreferenciaAcessibilidade.associate = function(models) {
    PreferenciaAcessibilidade.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return PreferenciaAcessibilidade;
};