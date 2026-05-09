/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Allow any external image in development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Needed for Prisma to work correctly on Vercel
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
