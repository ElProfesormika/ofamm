/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuration pour la production sur Railway
  output: 'standalone',
  // Optimisation des images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    // Permettre les images locales depuis /uploads/ et autres chemins relatifs
    unoptimized: false,
    // Configuration pour les images locales et distantes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Formats d'images supportés
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;

