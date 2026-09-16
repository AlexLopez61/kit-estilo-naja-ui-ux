import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    // El "segment explorer" de los devtools de Next corrompe el manifest tras
    // varios ciclos de HMR en dev (webpack) y tira 500. Apagado desde el origen.
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
