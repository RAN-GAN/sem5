import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col relative p-4">
          <h1 className="text-2xl font-bold mb-4 text-red-400">
            Something went wrong
          </h1>
          <p className="mb-4">
            There was an error in the application. Please try again or contact
            support.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg mb-4 overflow-auto max-h-[400px]">
            <h2 className="text-xl mb-2 font-semibold">Error Details:</h2>
            <p className="text-red-300">
              {this.state.error && this.state.error.toString()}
            </p>
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Component Stack:</h3>
              <pre className="text-gray-400 text-sm overflow-auto">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
