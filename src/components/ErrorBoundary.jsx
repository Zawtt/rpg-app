import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorMessage: '',
      errorStack: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      errorMessage: error.message,
      errorStack: error.stack
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error caught by ErrorBoundary:', {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Aqui você poderia enviar para um serviço de logging como Sentry
    // sendErrorToLoggingService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      errorMessage: '',
      errorStack: '',
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-gray-100 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/20 rounded-full border border-red-500/30 mb-4">
                <AlertTriangle size={40} className="text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-red-400 mb-2">
                Oops! Algo deu errado
              </h1>
              <p className="text-gray-400 text-lg">
                A aplicação encontrou um erro inesperado
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-gray-900/80 rounded-lg border border-gray-700 p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" />
                Detalhes do Erro
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Mensagem:
                  </label>
                  <code className="block bg-gray-800 p-3 rounded text-red-300 text-sm break-words">
                    {this.state.errorMessage || 'Erro desconhecido'}
                  </code>
                </div>
                
                {process.env.NODE_ENV === 'development' && this.state.errorStack && (
                  <details className="group">
                    <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 transition-colors">
                      Stack Trace (desenvolvimento)
                    </summary>
                    <pre className="mt-2 bg-gray-800 p-3 rounded text-xs text-gray-300 overflow-auto max-h-32 whitespace-pre-wrap">
                      {this.state.errorStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <RefreshCw size={20} />
                Tentar Novamente
              </button>
              
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
              >
                <Home size={20} />
                Recarregar Página
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-sm text-gray-500">
              <p>
                Se o problema persistir, tente recarregar a página ou entre em contato com o suporte.
              </p>
              {this.state.retryCount > 0 && (
                <p className="mt-2 text-yellow-400">
                  Tentativas de recuperação: {this.state.retryCount}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;