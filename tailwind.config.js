module.exports = {
  purge: {
    enabled: process.env.NODE_ENV !== 'development',
    content: [
      './src/**/*.html',
      './src/**/*.ejs',
      './src/**/*.tsx',
      './src/**/*.ts',
      './src/**/*.js',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['responsive', 'active'],
    extend: {},
  },
  plugins: [],
};
