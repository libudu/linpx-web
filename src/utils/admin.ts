const password = localStorage.getItem('password');

export const isAdmin = () => {
  return Boolean(password);
};

export const getPassword = () => {
  return password;
};
