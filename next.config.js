/** @type {import('next').NextConfig} */

const shouldAnalyzeBundles = process.env.ANALYZE === "true";

let nextConfig = {
  reactStrictMode: true,
};

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer = require("next-bundle-analyzer")();
  nextConfig = withNextBundleAnalyzer(nextConfig);
}

module.exports = nextConfig;
