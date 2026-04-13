import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // All pages are dynamic (require Supabase at runtime)
  // This prevents static generation failures when env vars are absent at build time
  experimental: {},
}

export default nextConfig
