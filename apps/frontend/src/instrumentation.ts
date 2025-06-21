export async function register() {
  // Only initialize Sentry in production to avoid OpenTelemetry warnings
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
    // Dynamic import to avoid bundling OpenTelemetry modules in development
    const Sentry = await import('@sentry/nextjs');
    
    const sentryOptions = {
      // Sentry DSN
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Disable Spotlight in production
      spotlight: false,

      // Adds request headers and IP for users, for more info visit
      sendDefaultPii: true,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 1,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false
    };

    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // Node.js Sentry configuration
      Sentry.init(sentryOptions);
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      // Edge Sentry configuration
      Sentry.init(sentryOptions);
    }
  }
}
