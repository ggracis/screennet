import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "screen.net.ar",
      },
      {
        protocol: "https",
        hostname: "screen.net.ar",
      },
    ],
  },
  serverRuntimeConfig: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export default nextConfig;
