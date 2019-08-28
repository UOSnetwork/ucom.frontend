export const saveToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (e) {
    console.error(e);
  }
};

export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (e) {
    console.error(e);
  }
};

export const getCookie = (name) => {
  try {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

    if (!match) {
      return null;
    }

    return match[2];
  } catch (e) {
    return null;
  }
};
