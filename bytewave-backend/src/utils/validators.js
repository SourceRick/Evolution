import { isValidEmail, isValidCPF } from './helpers';

/**
 * Validações de formulário
 */
export const validators = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return 'Este campo é obrigatório';
    }
    return null;
  },

  email: (value) => {
    if (value && !isValidEmail(value)) {
      return 'Email inválido';
    }
    return null;
  },

  cpf: (value) => {
    if (value && !isValidCPF(value)) {
      return 'CPF inválido';
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Mínimo de ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Máximo de ${max} caracteres`;
    }
    return null;
  },

  min: (min) => (value) => {
    if (value !== null && value !== undefined && Number(value) < min) {
      return `Valor mínimo é ${min}`;
    }
    return null;
  },

  max: (max) => (value) => {
    if (value !== null && value !== undefined && Number(value) > max) {
      return `Valor máximo é ${max}`;
    }
    return null;
  },

  password: (value) => {
    if (value) {
      if (value.length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres';
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'A senha deve conter pelo menos uma letra minúscula';
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'A senha deve conter pelo menos uma letra maiúscula';
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'A senha deve conter pelo menos um número';
      }
    }
    return null;
  },

  confirmPassword: (password) => (value) => {
    if (value !== password) {
      return 'As senhas não coincidem';
    }
    return null;
  },

  phone: (value) => {
    if (value) {
      const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
      if (!phoneRegex.test(value)) {
        return 'Telefone inválido';
      }
    }
    return null;
  },

  url: (value) => {
    if (value) {
      try {
        new URL(value);
        return null;
      } catch {
        return 'URL inválida';
      }
    }
    return null;
  },

  date: (value) => {
    if (value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
    }
    return null;
  },

  futureDate: (value) => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      if (date <= today) {
        return 'A data deve ser futura';
      }
    }
    return null;
  },

  pastDate: (value) => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      if (date >= today) {
        return 'A data deve ser passada';
      }
    }
    return null;
  }
};

/**
 * Validação de formulário completo
 */
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];
    
    if (Array.isArray(fieldRules)) {
      for (const rule of fieldRules) {
        const error = rule(value);
        if (error) {
          errors[field] = error;
          break;
        }
      }
    } else if (typeof fieldRules === 'function') {
      const error = fieldRules(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Schema de validação para usuário
 */
export const userValidationSchema = {
  nome: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  cpf: [validators.cpf],
  telefone: [validators.phone],
  data_nascimento: [validators.date]
};

/**
 * Schema de validação para post
 */
export const postValidationSchema = {
  titulo: [validators.required, validators.minLength(5)],
  conteudo: [validators.required, validators.minLength(10)]
};

/**
 * Schema de validação para atividade
 */
export const activityValidationSchema = {
  titulo: [validators.required, validators.minLength(5)],
  descricao: [validators.required],
  data_entrega: [validators.required, validators.futureDate],
  valor_maximo: [validators.required, validators.min(0)]
};