import { withRouter } from 'react-router';
import { useState, useEffect } from 'react';

const HashRouter = ({ children, location }) => {
  const [route, setRoute] = useState(null);

  const onLocationChanged = () => {
    setRoute(window.location.hash);
  };

  useEffect(() => {
    window.addEventListener('hashchange', onLocationChanged);

    return () => {
      window.removeEventListener('hashchange', onLocationChanged);
    };
  }, []);

  useEffect(() => {
    onLocationChanged();
  }, [location]);

  return children(route);
};

export default withRouter(HashRouter);
