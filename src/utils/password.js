export const passwordIsValid = (password) => {
  try {
    return password.length > 0;
  } catch (e) {
    return false;
  }
};
