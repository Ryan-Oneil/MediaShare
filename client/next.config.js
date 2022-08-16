/** @type {import('next').NextConfig} */

const shouldAnalyzeBundles = process.env.ANALYZE === "true";

let nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com"],
  },
  output: "standalone",
};

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer = require("next-bundle-analyzer")();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
