import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Toast = ({ id, message, type = 'info', duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { removeToast } = useAppContext();

  // Configurações por tipo
  const toastConfig = {
    success: {
      icon: CheckCircle,
      classes: 'bg-emerald-900/95 border-emerald-700/50 text-emerald-100',
      iconColor: 'text-emerald-400'
    },
    error: {
      icon: AlertCircle,
      classes: 'bg-red-900/95 border-red-700/50 text-red-100',
      iconColor: 'text-red-400'
    },
    warning: {
      icon: AlertTriangle,
      classes: 'bg-yellow-900/95 border-yellow-700/50 text-yellow-100',
      iconColor: 'text-yellow-400'
    },
    info: {
      icon: Info,
      classes: 'bg-blue-900/95 border-blue-700/50 text-blue-100',
      iconColor: 'text-blue-400'
    }
  };

  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(id);
    }, 300); // Duração da animação de saída
  };

  // Barra de progresso
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const decrement = (100 / duration) * 50; // 50ms interval
          return Math.max(0, prev - decrement);
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [duration]);

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isLeaving ? 'translate-x-full opacity-0 scale-95' : ''}
      `}
      role="alert"
      aria-live="polite"
    >
      <div
        className={`
          relative min-w-80 max-w-md p-4 rounded-lg border backdrop-blur-sm shadow-2xl
          ${config.classes}
          hover:scale-105 transition-transform duration-200
        `}
      >
        {/* Conteúdo principal */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon size={20} />
          </div>
          
          {/* Mensagem */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-relaxed break-words">
              {message}
            </p>
          </div>
          
          {/* Botão de fechar */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label="Fechar notificação"
          >
            <X size={16} className="opacity-70 hover:opacity-100" />
          </button>
        </div>
        
        {/* Barra de progresso */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-lg overflow-hidden">
            <div
              className="h-full bg-white/30 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Container de Toasts
export const ToastContainer = () => {
  const { ui } = useAppContext();
  
  if (!ui.toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
      {ui.toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;