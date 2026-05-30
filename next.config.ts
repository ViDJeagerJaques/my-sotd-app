const nextConfig = {
  eslint: {
    // Memaksa Cloud Run mengabaikan error ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Memaksa Cloud Run mengabaikan error TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;