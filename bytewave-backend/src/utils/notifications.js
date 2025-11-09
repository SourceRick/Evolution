/**
 * Sistema de notificações toast
 */
class NotificationManager {
  constructor() {
    this.subscribers = [];
    this.nextId = 1;
  }

  subscribe(callback) {
    const id = this.nextId++;
    this.subscribers.push({ id, callback });
    
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub.id !== id);
    };
  }

  notify(notification) {
    this.subscribers.forEach(({ callback }) => {
      callback(notification);
    });
  }

  success(message, options = {}) {
    this.notify({
      type: 'success',
      message,
      ...options
    });
  }

  error(message, options = {}) {
    this.notify({
      type: 'error',
      message,
      ...options
    });
  }

  warning(message, options = {}) {
    this.notify({
      type: 'warning',
      message,
      ...options
    });
  }

  info(message, options = {}) {
    this.notify({
      type: 'info',
      message,
      ...options
    });
  }
}

// Instância global
export const notificationManager = new NotificationManager();

/**
 * Hook para usar notificações (para usar em componentes)
 */
export const useNotifications = () => {
  const showNotification = (type, message, options = {}) => {
    notificationManager[type](message, options);
  };

  return {
    success: (message, options) => showNotification('success', message, options),
    error: (message, options) => showNotification('error', message, options),
    warning: (message, options) => showNotification('warning', message, options),
    info: (message, options) => showNotification('info', message, options),
    subscribe: (callback) => notificationManager.subscribe(callback)
  };
};

/**
 * Tratamento de erros da API
 */
export const handleApiError = (error, defaultMessage = 'Erro inesperado') => {
  const message = error?.message || error?.error || defaultMessage;
  
  if (error?.status === 401) {
    notificationManager.error('Sessão expirada. Faça login novamente.');
    // Redirecionar para login
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  } else if (error?.status === 403) {
    notificationManager.error('Você não tem permissão para esta ação.');
  } else if (error?.status === 404) {
    notificationManager.error('Recurso não encontrado.');
  } else if (error?.status >= 500) {
    notificationManager.error('Erro interno do servidor. Tente novamente mais tarde.');
  } else {
    notificationManager.error(message);
  }
  
  console.error('API Error:', error);
};

/**
 * Sucesso da API
 */
export const handleApiSuccess = (message = 'Operação realizada com sucesso!') => {
  notificationManager.success(message);
};