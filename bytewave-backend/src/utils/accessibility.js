import { THEMES, FONT_SIZES, READING_SPEEDS } from './constants';
import { appStorage } from './storage';

/**
 * Utilitários de acessibilidade
 */
export const accessibility = {
  /**
   * Aplica tema no documento
   */
  applyTheme(theme) {
    const root = document.documentElement;
    
    // Remove classes anteriores
    root.classList.remove('theme-claro', 'theme-escuro', 'theme-auto');
    
    // Determina tema efetivo
    let effectiveTheme = theme;
    if (theme === THEMES.AUTO) {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.ESCURO 
        : THEMES.CLARO;
    }
    
    // Aplica tema
    root.classList.add(`theme-${effectiveTheme}`);
    appStorage.setTheme(theme);
  },

  /**
   * Aplica tamanho da fonte
   */
  applyFontSize(size) {
    const root = document.documentElement;
    const sizes = {
      [FONT_SIZES.PEQUENO]: '14px',
      [FONT_SIZES.MEDIO]: '16px',
      [FONT_SIZES.GRANDE]: '18px',
      [FONT_SIZES.MUITO_GRANDE]: '20px'
    };
    
    root.style.setProperty('--font-size-base', sizes[size] || '16px');
  },

  /**
   * Aplica alto contraste
   */
  applyHighContrast(enabled) {
    const root = document.documentElement;
    
    if (enabled) {
      root.classList.add('alto-contraste');
    } else {
      root.classList.remove('alto-contraste');
    }
  },

  /**
   * Aplica fonte legível
   */
  applyReadableFont(enabled) {
    const root = document.documentElement;
    
    if (enabled) {
      root.classList.add('fonte-legivel');
      root.style.setProperty('--font-family', 'Arial, Helvetica, sans-serif');
    } else {
      root.classList.remove('fonte-legivel');
      root.style.setProperty('--font-family', 'Inter, sans-serif');
    }
  },

  /**
   * Aplica espaçamento do texto
   */
  applyTextSpacing(spacing) {
    const root = document.documentElement;
    root.style.setProperty('--line-height', spacing.toString());
  },

  /**
   * Configura atalhos de teclado
   */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + 1 - Ir para conteúdo principal
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        this.focusMainContent();
      }
      
      // Alt + 2 - Ir para menu
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        this.focusNavigation();
      }
      
      // Alt + T - Alternar tema
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // Alt + A - Alternar alto contraste
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        this.toggleHighContrast();
      }
      
      // Escape - Fechar modais
      if (e.key === 'Escape') {
        this.closeModals();
      }
    });
  },

  /**
   * Foca no conteúdo principal
   */
  focusMainContent() {
    const main = document.querySelector('main') || document.querySelector('#main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  },

  /**
   * Foca na navegação
   */
  focusNavigation() {
    const nav = document.querySelector('nav') || document.querySelector('#navigation');
    if (nav) {
      nav.setAttribute('tabindex', '-1');
      nav.focus();
    }
  },

  /**
   * Alterna tema
   */
  toggleTheme() {
    const currentTheme = appStorage.getTheme();
    const themes = Object.values(THEMES);
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    this.applyTheme(nextTheme);
  },

  /**
   * Alterna alto contraste
   */
  toggleHighContrast() {
    const root = document.documentElement;
    const isEnabled = root.classList.contains('alto-contraste');
    this.applyHighContrast(!isEnabled);
  },

  /**
   * Fecha modais abertos
   */
  closeModals() {
    // Dispara evento para fechar modais
    const event = new CustomEvent('closeModals');
    document.dispatchEvent(event);
  },

  /**
   * Anuncia mudanças para leitores de tela
   */
  announceToScreenReader(message, priority = 'polite') {
    const announcement = document.getElementById('a11y-announcement');
    
    if (announcement) {
      announcement.setAttribute('aria-live', priority);
      announcement.textContent = message;
    }
  },

  /**
   * Verifica se animações devem ser reduzidas
   */
  shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Inicializa acessibilidade
   */
  initialize() {
    // Aplica preferências salvas
    const preferences = appStorage.getPreferences();
    
    if (preferences.tema) {
      this.applyTheme(preferences.tema);
    }
    
    if (preferences.tamanhoFonte) {
      this.applyFontSize(preferences.tamanhoFonte);
    }
    
    if (preferences.altoContraste) {
      this.applyHighContrast(preferences.altoContraste);
    }
    
    if (preferences.fonteLegivel) {
      this.applyReadableFont(preferences.fonteLegivel);
    }
    
    if (preferences.espacamentoTexto) {
      this.applyTextSpacing(preferences.espacamentoTexto);
    }
    
    // Configura atalhos se habilitado
    if (preferences.navegacaoTeclado !== false) {
      this.setupKeyboardShortcuts();
    }
    
    // Adiciona elemento para anúncios de leitor de tela
    if (!document.getElementById('a11y-announcement')) {
      const announcement = document.createElement('div');
      announcement.id = 'a11y-announcement';
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcement);
    }
  }
};

export default accessibility;