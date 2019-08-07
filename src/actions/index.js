// TODO: Refactoring (split and separate to sub files)
export const setUser = payload => ({ type: 'SET_USER', payload });
export const setUserLoading = (loading = false) => ({ type: 'SET_LOADING', payload: loading });
export const removeUser = () => ({ type: 'REMOVE_USER' });
