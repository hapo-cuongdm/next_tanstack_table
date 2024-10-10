/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "cloudflare-ipfs.com",
    ],
  },
  i18n: {
    locales: ['en', 'ja', 'vi'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

export default nextConfig;
