import React from 'react';
import { Loader2, Dices, Save, Download } from 'lucide-react';

const LoadingSpinner = ({ type = 'default', size = 'md', message, className = '' }) => {
  // Configurações de tamanho
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // Configurações por tipo
  const typeConfig = {
    default: {
      icon: Loader2,
      animation: 'animate-spin',
      color: 'text-blue-400'
    },
    dice: {
      icon: Dices,
      animation: 'animate-bounce',
      color: 'text-orange-400'
    },
    saving: {
      icon: Save,
      animation: 'animate-pulse',
      color: 'text-emerald-400'
    },
    loading: {
      icon: Download,
      animation: 'animate-pulse',
      color: 'text-blue-400'
    }
  };

  const config = typeConfig[type] || typeConfig.default;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon 
        className={`${sizeClasses[size]} ${config.color} ${config.animation}`}
      />
      {message && (
        <span className="text-sm text-gray-400 font-medium">
          {message}
        </span>
      )}
    </div>
  );
};

// Componente para loading de página inteira
export const FullPageLoading = ({ message = 'Carregando...' }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="text-center">
        <LoadingSpinner 
          type="default" 
          size="xl" 
          className="justify-center mb-4" 
        />
        <p className="text-gray-300 text-lg font-medium">
          {message}
        </p>
      </div>
    </div>
  );
};

// Componente para loading inline
export const InlineLoading = ({ type, message, size = 'sm' }) => {
  return (
    <div className="inline-flex items-center">
      <LoadingSpinner 
        type={type} 
        size={size} 
        message={message}
      />
    </div>
  );
};

// Loading Button - botão com estado de loading
export const LoadingButton = ({ 
  children, 
  loading = false, 
  loadingText, 
  loadingType = 'default',
  disabled,
  className = '',
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        flex items-center justify-center gap-2 transition-all duration-200
        ${loading ? 'cursor-not-allowed opacity-75' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <LoadingSpinner type={loadingType} size="sm" />
          {loadingText || 'Carregando...'}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingSpinner;