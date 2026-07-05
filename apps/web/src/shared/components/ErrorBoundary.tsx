import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time errors anywhere below it in the tree so one broken
 * widget doesn't take down the whole desktop. Logs to console; wire up a
 * real error-reporting call in componentDidCatch when one exists.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  reset = (): void => this.setState({ error: null });

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(error, this.reset);
    }

    return (
      <div
        role="alert"
        style={{
          padding: 24,
          margin: 16,
          border: "1px solid var(--color-danger)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg-raised)",
          color: "var(--color-text)",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 4 }}>Something broke here.</p>
        <p style={{ color: "var(--color-text-dim)", fontSize: 13, marginBottom: 12 }}>
          {error.message}
        </p>
        <button
          onClick={this.reset}
          style={{
            background: "var(--color-accent)",
            color: "#06110d",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "6px 12px",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
