/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' https://www.google.com https://www.gstatic.com 'unsafe-inline' 'unsafe-eval';
              frame-src 'self' https://calendar.google.com;
              style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
              img-src 'self' https://www.gstatic.com data:;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self';
            `.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};
