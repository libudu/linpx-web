const password = localStorage.getItem('password');

export const isAdmin = () => {
  return Boolean(password) && location.hostname === 'localhost';
};

export const getPassword = () => {
  return password;
};
