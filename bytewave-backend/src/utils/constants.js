// Constantes do sistema
export const APP_CONFIG = {
  NAME: 'ByteWave',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema Escolar Inteligente',
  API_BASE_URL: 'http://localhost:3000/api',
  UPLOAD_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FILE_TYPES: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ]
};

// Tipos de usuário
export const USER_TYPES = {
  ADMIN: 'admin',
  PROFESSOR: 'professor',
  ALUNO: 'aluno',
  MODERADOR: 'moderador'
};

// Tipos de post
export const POST_TYPES = {
  TRABALHO: 'Trabalho',
  DUVIDA: 'Duvida',
  MATERIAL: 'Material',
  ANUNCIO: 'Anuncio',
  EVENTO: 'Evento',
  DISCUSSAO: 'Discussao'
};

// Visibilidade do post
export const POST_VISIBILITY = {
  PUBLICO: 'Publico',
  TURMA: 'Turma',
  CURSO: 'Curso',
  PRIVADO: 'Privado'
};

// Tipos de atividade
export const ACTIVITY_TYPES = {
  TRABALHO: 'Trabalho',
  PROVA: 'Prova',
  EXERCICIO: 'Exercicio',
  PROJETO: 'Projeto',
  APRESENTACAO: 'Apresentacao'
};

// Status de trabalho
export const WORK_STATUS = {
  RASCUNHO: 'Rascunho',
  ENTREGUE: 'Entregue',
  AVALIADO: 'Avaliado',
  ATRASADO: 'Atrasado',
  CORRIGIR: 'Corrigir'
};

// Status de presença
export const ATTENDANCE_STATUS = {
  PRESENTE: 'Presente',
  FALTA: 'Falta',
  FALTA_JUSTIFICADA: 'FaltaJustificada',
  ATRASO: 'Atraso'
};

// Turnos
export const SHIFTS = {
  MANHA: 'Manha',
  TARDE: 'Tarde',
  NOITE: 'Noite',
  INTEGRAL: 'Integral'
};

// Temas
export const THEMES = {
  CLARO: 'claro',
  ESCURO: 'escuro',
  AUTO: 'auto'
};

// Tamanhos de fonte
export const FONT_SIZES = {
  PEQUENO: 'pequeno',
  MEDIO: 'medio',
  GRANDE: 'grande',
  MUITO_GRANDE: 'muito_grande'
};

// Velocidades de leitura
export const READING_SPEEDS = {
  LENTA: 'lenta',
  NORMAL: 'normal',
  RAPIDA: 'rapida'
};

// Cores do sistema
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4'
};

// LocalStorage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'bytewave-theme',
  PREFERENCES: 'bytewave-preferences'
};