/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'cdn.shopify.com',
      'wazabilabs.com',
      'blob.v0.dev',
      'placeholder.svg'
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://test.authorize.net https://accept.authorize.net https://api.authorize.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "connect-src 'self' http://localhost:4000 https://test.authorize.net https://accept.authorize.net https://api.authorize.net https://*.supabase.co wss://*.supabase.co",
              "frame-src 'self' https://test.authorize.net https://accept.authorize.net https://api.authorize.net",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://test.authorize.net https://accept.authorize.net",
              "frame-ancestors 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ]
  },
}

export default nextConfig
