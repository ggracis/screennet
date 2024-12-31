import withMDX from "@next/mdx";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "screen.net.ar",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default withMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
})(nextConfig);
