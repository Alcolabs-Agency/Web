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
            // Scripts
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://cdn.jsdelivr.net; " +
            // Workers
            "worker-src 'self' blob:; " +
            // Aquí todos tus dominios de fetch
            "connect-src 'self' http://127.0.0.1:5000 http://localhost:5000 blob: data: https://cdn.jsdelivr.net https://backend-ocr.onrender.com; " +
            // Imágenes
            "img-src 'self' https://www.gstatic.com data: blob:; " +
            // Frames
            "frame-src 'self' https://calendar.google.com; " +
            // Estilos
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            // Fuentes
            "font-src 'self' https://fonts.gstatic.com;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
