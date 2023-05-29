const password = localStorage.getItem('password');

export const isAdmin = () => {
  return Boolean(password) && location.hostname === 'localhost';
};

export const getPassword = () => {
  return password;
};

export const isSafeMode = location.hostname === 'slinpx.linpicio.com';
