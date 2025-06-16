/** @type {import('next').NextConfig} */
export const i18n = {
  locales: ['en', 'uz', 'ru', 'ko'],
  defaultLocale: 'en',
};

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  i18n,
}

export default nextConfig
