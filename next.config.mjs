/** @type {import('next').NextConfig} */

// TODO: Set CSP on Deploy

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-XSS-Protection",
            value: "0"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), camera=(), fullscreen=(), microphone=()"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000"
          },
          {
            key: "Referrer-Policy",
            value:
              "origin-when-cross-origin, strict-origin-when-cross-origin, no-referrer"
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
