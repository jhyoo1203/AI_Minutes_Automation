export const LOGOUT = 'LOGOUT';

export const logout = () => {
  localStorage.clear();

  return {
    type: LOGOUT
  };
};