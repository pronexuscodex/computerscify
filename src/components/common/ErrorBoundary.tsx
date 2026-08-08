import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** When this value changes while an error is shown, the boundary resets (e.g. pass the current view/route). */
  resetKey?: unknown;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  private handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full" role="alert">
        <div className="bg-[#FFFFFF] dark:bg-[#1E1C1C] border-4 border-[#000000] neo-shadow rounded p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F2C94C] border-2 border-[#000000] rounded text-[#151313] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base">
              {this.props.fallbackTitle || 'Something went wrong loading this view'}
            </h3>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-mono break-words">
            {error.message || 'An unexpected error occurred.'}
          </p>

          <button
            type="button"
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#151313] text-white font-bold text-xs rounded transition-colors hover:bg-[#F2C94C] hover:text-[#151313] min-h-[44px]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }
}
