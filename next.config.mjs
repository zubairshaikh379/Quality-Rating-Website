/** @type {import('next').NextConfig} */
import { NextConfig } from 'next';
import { Configuration, RuleSetRule } from 'webpack';

const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    const fileLoaderRule = config.module?.rules?.find((rule) => {
      if (
        typeof rule === 'object' &&
        rule !== null &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        rule.test !== undefined && // Explicit check for undefined
        rule.test instanceof RegExp && rule.test.test('.(png|jpg|jpeg|gif|webp|avif)(?!\\.svg)$')
      ) {
        return true;
      }
      return false;
    }) || undefined;

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module?.rules?.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;