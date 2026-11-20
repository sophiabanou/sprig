import { Component } from 'react'

/* Shows the fallback instead of unmounting the whole app when a part of the page throws, for example a lazy chunk that fails to load. */
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    const { fallback = null, children = null } = this.props
    return this.state.hasError ? fallback : children
  }
}
