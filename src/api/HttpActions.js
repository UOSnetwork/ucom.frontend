import objectToFormData from 'object-to-formdata';
import * as axios from 'axios';
import { getToken } from '../utils/token';

class HttpActions {
  constructor(baseURL) {
    this.request = axios.create({ baseURL });
  }

  getOptions(extraOptions = {}) {
    const token = getToken();
    let options = {
      withCredentials: true,
      headers: {},
    };

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    options = {
      ...options,
      ...extraOptions,
      headers: {
        ...options.headers,
        ...extraOptions.headers,
      },
    };

    return options;
  }

  get(url, params, options) {
    const config = { params, ...this.getOptions(options) };

    return this.request.get(url, config);
  }

  post(url, data, options) {
    const formData = objectToFormData(data, {
      indices: true,
    });

    return this.request.post(url, formData, { ...this.getOptions(options) });
  }

  patch(url, data, options) {
    const formData = objectToFormData(data, {
      indices: true,
    });

    return this.request.patch(url, formData, { ...this.getOptions(options) });
  }

  put(url, data, params, options) {
    const formData = objectToFormData(data, {
      indices: true,
    });

    return this.request.put(url, formData, { params, ...this.getOptions(options) });
  }

  del(url, data, params, options) {
    const config = {
      url, data, params, ...this.getOptions(options),
    };

    return this.request.delete(url, config);
  }
}

export default HttpActions;
