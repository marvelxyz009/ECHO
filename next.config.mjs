/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: false,
    optimizePackageImports: ["framer-motion"],
    typedRoutes: true
  },
  output: process.env.NEXT_OUTPUT_MODE === "export" ? "export" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;

