/** @type {import('next').NextConfig} */
const nextConfig = {
  // webpack: (config) => {
  //   // this will override the experiments
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   // this will just update topLevelAwait property of config.experiments
  //   // config.experiments.topLevelAwait = true
  //   return config;
  // },
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

export default nextConfig;
