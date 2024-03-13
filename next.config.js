/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')
const runtimeCaching = require('./cache')


const shouldAnalyzeBundles = !!process.env.ANALYZE;

let nextConfig =
  {
    pwa: {
      dest: 'public',
      runtimeCaching,
      buildExcludes: [/middleware-manifest.json$/]
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
      return config;
    },
    images: {
      domains: ['app.musterim.net','musterim.net','127.0.0.1'],
    },
  }
  ;

if (shouldAnalyzeBundles) {
  const withNextBundleAnalyzer =
    require('next-bundle-analyzer')(/* options come there */);
  nextConfig = withNextBundleAnalyzer(nextConfig);
}
module.exports = withPWA(nextConfig);