// https://reactjs.org/docs/error-boundaries.html
import * as React from "react";

export interface ErrorBoundaryProps {
}

export interface ErrorBoundaryState {
    error?: Error,
    errorInfo: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {error: null, errorInfo: null};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({error, errorInfo});
    }

    render(): React.ReactNode {
        if (this.state.error) {
            // You can render any custom fallback UI
            return <pre>Something went wrong: ${this.state.error.message}
${this.state.error.stack}
</pre>;
        }
        return this.props.children;
    }
}
