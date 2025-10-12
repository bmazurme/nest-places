export const helmetConfig = {
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
    connectSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
    styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", '*'],
    imgSrc: ['*'],
  },
};
