import helmet from 'helmet';

// Function to configure security headers using Helmet
export const helmetConfig = () => {
  return helmet({
    // Content Security Policy (CSP) to prevent content injection attacks (XSS, etc.)
    contentSecurityPolicy: {
      directives: {
        // Restricts the sources from which content (e.g., images, scripts) can be loaded.
        defaultSrc: ["'self'"], // Only allow resources from the same origin (self).
        frameAncestors: ["'self'"], // Prevent the page from being embedded in frames or iframes.
        objectSrc: ["'none'"], // Block object, embed, or applet elements.
        scriptSrc: ["'self'"], // Only allow scripts from the same origin.
        scriptSrcAttr: ["'none'"], // Block inline script execution via the `script` tag attributes.
        styleSrc: ["'self'"], // Only allow styles from the same origin.
      },
    },

    // Strict Transport Security (HSTS) to enforce secure connections
    strictTransportSecurity: {
      maxAge: 31536000, // Forces HTTPS for 1 year (31536000 seconds).
      includeSubDomains: true, // Apply this rule to all subdomains.
    },
  });
};
