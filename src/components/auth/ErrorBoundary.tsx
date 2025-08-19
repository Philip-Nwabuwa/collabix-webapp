import React from "react";

type ErrorBoundaryProps = {
  fallback?: React.ReactNode;
  onReset?: () => void;
  children: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // Optional: report to monitoring service
    // console.error("Uncaught error:", _error, _errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="h-screen w-full flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-muted-foreground">Please try again.</p>
            <button className="mt-4 underline" onClick={this.handleReset}>
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
