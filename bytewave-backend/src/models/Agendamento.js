const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agendamento = sequelize.define('Agendamento', {
    id_agendamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descricao: DataTypes.TEXT,
    data_agendamento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fim: {
      type: DataTypes.TIME,
      allowNull: false
    },
    id_sala: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_professor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_turma: DataTypes.INTEGER,
    tipo_evento: {
      type: DataTypes.ENUM('Aula', 'Prova', 'Reuniao', 'Evento', 'Estudo'),
      defaultValue: 'Aula'
    },
    status: {
      type: DataTypes.ENUM('Agendado', 'Confirmado', 'Cancelado', 'Concluido'),
      defaultValue: 'Agendado'
    },
    recorrente: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    config_recorrencia: DataTypes.JSON
  }, {
    tableName: 'agendamento',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Agendamento.associate = function(models) {
    Agendamento.belongsTo(models.Sala, { foreignKey: 'id_sala' });
    Agendamento.belongsTo(models.Professor, { foreignKey: 'id_professor' });
    Agendamento.belongsTo(models.Turma, { foreignKey: 'id_turma' });
    Agendamento.hasMany(models.AgendamentoRecurso, { foreignKey: 'id_agendamento' });
  };

  return Agendamento;
};