import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Sanity Studio (mounted client-only at /studio) ships bundles that
  // use newer React APIs (e.g. useEffectEvent) than the "react-server"
  // module condition Next's webpack build applies while tracing every
  // module for the server compiler pass — even ones only ever reached
  // through a client-only, ssr:false import. Marking these packages
  // external makes Next require() them directly at runtime with plain
  // Node resolution instead of bundling/re-resolving 'react' through
  // them, which sidesteps that mismatch.
  serverExternalPackages: [
    "sanity",
    "next-sanity",
    "@sanity/vision",
    "@sanity/client",
    "sanity-plugin-cloudinary",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
