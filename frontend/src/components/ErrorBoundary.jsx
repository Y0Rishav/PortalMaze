import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900">
                    <div className="border border-red-200 p-8 rounded max-w-2xl w-full text-center">
                        <h1 className="text-2xl font-bold mb-4">⚠️ Oops!</h1>
                        <h2 className="text-xl font-semibold mb-4">
                            Something went wrong
                        </h2>
                        <p className="mb-4">
                            We encountered an unexpected error. Please try refreshing the page.
                        </p>
                        <pre className="bg-red-100 p-4 rounded text-sm overflow-auto mb-6 text-left">
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
