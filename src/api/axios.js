import * as axios from 'axios';

axios.interceptors.response.use(resp => resp, (err) => {
  if (err.response.status === 401 && typeof window !== 'undefined') {
    window.location.replace('/');
  }

  return err;
});

export default axios;
