import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { crashed: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { crashed: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[POLYMATH OS] Render error:', error, info);
  }

  render() {
    if (!this.state.crashed) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0f',
        color: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace',
        gap: 20,
        padding: 32,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 32, color: '#ef4444' }}>⚠</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9' }}>
          Something crashed
        </div>
        <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 420, lineHeight: 1.6 }}>
          Your data is safe — it&apos;s stored locally in your browser.
          Reload the page to continue.
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#14b8a6',
            color: '#0a0a0f',
            border: 'none',
            borderRadius: 6,
            padding: '10px 24px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: '0.05em',
          }}
        >
          RELOAD
        </button>
        <details style={{ fontSize: 11, color: '#64748b', marginTop: 8 }}>
          <summary style={{ cursor: 'pointer' }}>error details</summary>
          <pre style={{ marginTop: 8, textAlign: 'left', overflow: 'auto', maxWidth: 480 }}>
            {this.state.error?.toString()}
          </pre>
        </details>
      </div>
    );
  }
}
