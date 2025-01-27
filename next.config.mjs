/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net; " +
              "worker-src 'self' blob:; " +
              "connect-src 'self' blob: data: https://cdn.jsdelivr.net https://backend-ocr.onrender.com https://f68e-2802-8010-d540-9700-ae68-8b00.ngrok-free.app https://*.ngrok-free.app; " +
              "img-src 'self' https://www.gstatic.com data: blob:; " +
              "frame-src 'self' https://calendar.google.com; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' https://fonts.gstatic.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
