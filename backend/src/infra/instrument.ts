/* eslint-disable @typescript-eslint/no-require-imports */
const Sentry = require('@sentry/nestjs')
const { nodeProfilingIntegration } = require('@sentry/profiling-node')

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  integrations: [nodeProfilingIntegration()],

  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  sendDefaultPii: true,
})
