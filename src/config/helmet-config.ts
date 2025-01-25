import helmet from 'helmet';

export const helmetConfig = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
  });
};
