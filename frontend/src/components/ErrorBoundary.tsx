import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white p-8">
          <div className="bg-red-500/10 p-8 rounded-2xl border border-red-500/20 text-center max-w-lg">
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong.</h2>
            <p className="text-slate-400 mb-4 text-sm">A component crashed in the application.</p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 mb-2">Show error details</summary>
                <pre className="text-xs text-rose-300 bg-slate-900/80 p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap break-all">
                  {this.state.error.name}: {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <button
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-medium transition-colors w-full"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
