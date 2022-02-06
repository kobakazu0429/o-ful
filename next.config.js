/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (config) => config;

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["tfansite.jp"],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
