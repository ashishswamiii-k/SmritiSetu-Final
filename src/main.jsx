import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SmritiSetu UI Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '32px', fontFamily: 'sans-serif', backgroundColor: '#F6F3EC', color: '#1B3A3A', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>SmritiSetu App Exception Detected</h2>
          <p style={{ marginTop: '8px', color: '#E8825F', fontWeight: 'bold' }}>
            {this.state.error?.toString()}
          </p>
          <pre style={{ marginTop: '16px', background: '#FFFFFF', padding: '16px', borderRadius: '8px', overflowX: 'auto', border: '1px solid #1B3A3A' }}>
            {this.state.errorStack || this.state.error?.stack || JSON.stringify(this.state.errorInfo)}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: '#E8825F', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reset Local Cache & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
