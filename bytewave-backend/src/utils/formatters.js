import { formatDate, formatDateTime, formatTime, formatCurrency, formatNumber, formatBytes } from './helpers';

/**
 * Formatadores específicos para o sistema
 */
export const formatters = {
  /**
   * Formata status do aluno
   */
  alunoStatus: (status) => {
    const statusMap = {
      'Ativo': 'Ativo',
      'Trancado': 'Trancado',
      'Concluido': 'Concluído',
      'Transferido': 'Transferido'
    };
    return statusMap[status] || status;
  },

  /**
   * Formata status da matrícula
   */
  matriculaStatus: (status) => {
    const statusMap = {
      'Ativa': 'Ativa',
      'Trancada': 'Trancada',
      'Concluida': 'Concluída',
      'Cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
  },

  /**
   * Formata status do professor
   */
  professorStatus: (status) => {
    const statusMap = {
      'Ativo': 'Ativo',
      'Afastado': 'Afastado',
      'Desligado': 'Desligado'
    };
    return statusMap[status] || status;
  },

  /**
   * Formata tipo de post
   */
  postType: (type) => {
    const typeMap = {
      'Trabalho': 'Trabalho',
      'Duvida': 'Dúvida',
      'Material': 'Material',
      'Anuncio': 'Anúncio',
      'Evento': 'Evento',
      'Discussao': 'Discussão'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata tipo de atividade
   */
  activityType: (type) => {
    const typeMap = {
      'Trabalho': 'Trabalho',
      'Prova': 'Prova',
      'Exercicio': 'Exercício',
      'Projeto': 'Projeto',
      'Apresentacao': 'Apresentação'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata status do trabalho
   */
  workStatus: (status) => {
    const statusMap = {
      'Rascunho': 'Rascunho',
      'Entregue': 'Entregue',
      'Avaliado': 'Avaliado',
      'Atrasado': 'Atrasado',
      'Corrigir': 'Precisa Corrigir'
    };
    return statusMap[status] || status;
  },

  /**
   * Formata status de presença
   */
  attendanceStatus: (status) => {
    const statusMap = {
      'Presente': 'Presente',
      'Falta': 'Falta',
      'FaltaJustificada': 'Falta Justificada',
      'Atraso': 'Atraso'
    };
    return statusMap[status] || status;
  },

  /**
   * Formata turno
   */
  shift: (turno) => {
    const turnoMap = {
      'Manha': 'Manhã',
      'Tarde': 'Tarde',
      'Noite': 'Noite',
      'Integral': 'Integral'
    };
    return turnoMap[turno] || turno;
  },

  /**
   * Formata tipo de evento de agendamento
   */
  eventType: (type) => {
    const typeMap = {
      'Aula': 'Aula',
      'Prova': 'Prova',
      'Reuniao': 'Reunião',
      'Evento': 'Evento',
      'Estudo': 'Estudo'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata status do agendamento
   */
  scheduleStatus: (status) => {
    const statusMap = {
      'Agendado': 'Agendado',
      'Confirmado': 'Confirmado',
      'Cancelado': 'Cancelado',
      'Concluido': 'Concluído'
    };
    return statusMap[status] || status;
  },

  /**
   * Formata tipo de recurso
   */
  resourceType: (type) => {
    const typeMap = {
      'Equipamento': 'Equipamento',
      'Material': 'Material',
      'Software': 'Software',
      'Outros': 'Outros'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata tipo de notificação
   */
  notificationType: (type) => {
    const typeMap = {
      'Sistema': 'Sistema',
      'Atividade': 'Atividade',
      'Comentario': 'Comentário',
      'Reacao': 'Reação',
      'Agendamento': 'Agendamento',
      'Prazo': 'Prazo',
      'Mensagem': 'Mensagem'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata prioridade da notificação
   */
  notificationPriority: (priority) => {
    const priorityMap = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta',
      'urgente': 'Urgente'
    };
    return priorityMap[priority] || priority;
  },

  /**
   * Formata tipo de mensagem
   */
  messageType: (type) => {
    const typeMap = {
      'Individual': 'Individual',
      'Turma': 'Turma',
      'Geral': 'Geral'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata tipo de justificativa de falta
   */
  absenceType: (type) => {
    const typeMap = {
      'Medica': 'Médica',
      'Familiar': 'Familiar',
      'Outros': 'Outros'
    };
    return typeMap[type] || type;
  },

  /**
   * Formata status da justificativa
   */
  justificationStatus: (status) => {
    const statusMap = {
      'Pendente': 'Pendente',
      'Aprovada': 'Aprovada',
      'Rejeitada': 'Rejeitada'
    };
    return statusMap[status] || status;
  }
};

/**
 * Combinadores com formatadores básicos
 */
export const format = {
  ...formatters,
  date: formatDate,
  dateTime: formatDateTime,
  time: formatTime,
  currency: formatCurrency,
  number: formatNumber,
  bytes: formatBytes
};

export default format;