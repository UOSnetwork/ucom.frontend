import ReactDOM from 'react-dom';
import { PureComponent } from 'react';

class Portal extends PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    const portalRoot = document.getElementById('portal-root');
    portalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    const portalRoot = document.getElementById('portal-root');
    portalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

export default Portal;
