/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' https://www.google.com https://www.gstatic.com 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
              worker-src 'self' blob:;
              connect-src 'self' blob: data: https://cdn.jsdelivr.net;
              img-src 'self' https://www.gstatic.com data: blob:;
              frame-src 'self' https://calendar.google.com;
              style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
              font-src 'self' https://fonts.gstatic.com;
            `.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
