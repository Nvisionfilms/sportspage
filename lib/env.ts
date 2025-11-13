/**
 * Environment variable validation
 * Ensures all required environment variables are set
 */

export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file.'
    )
  }
}

export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key]
  
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is not set`)
  }
  
  return value || fallback || ''
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}
