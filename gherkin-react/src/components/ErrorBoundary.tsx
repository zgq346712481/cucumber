// https://reactjs.org/docs/error-boundaries.html
import * as React from "react"

export interface IErrorBoundaryProps {
  color: string,
}

export interface IErrorBoundaryState {
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props)
    this.state = { error: undefined, errorInfo: undefined }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ error, errorInfo })
  }

    public render(): React.ReactNode {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <pre style={{backgroundColor: this.props.color}}>
          Something went wrong: ${this.state.error.message}
          {this.state.error.stack}
        </pre>
      )
    }
    return this.props.children
  }
}
