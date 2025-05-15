import { withPlausibleProxy } from 'next-plausible'
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  turbopack: {
    // ...
  },

  // For sharp. Maybe. I really don't remember why I have this.
  output: 'standalone',

  // webpack(config) {
  //   config.module.rules.push({
  //     test: /\.svg$/,
  //     use: ['@svgr/webpack'],
  //   })
  //   return config
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default withPayload(
  {
    devBundleServerPackages: false, // Moved to the correct place
  },
  withPlausibleProxy(
    {
      customDomain: 'https://analytics.jordy.world',
    },
    nextConfig,
  ),
)
