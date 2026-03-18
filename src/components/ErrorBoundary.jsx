import React from 'react';

class ErrorBoundary extends React.Component {
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
        <div style={{ padding: '20px', backgroundColor: '#fff', color: '#000' }}>
          <h2 style={{ color: 'red' }}>Une erreur est survenue</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#CC1A1A', color: 'white', borderRadius: '8px', border: 'none' }}
          >
            Retour à l'accueil
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
