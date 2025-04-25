/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    const fileLoaderRule = config.module?.rules?.find((rule): rule is RuleSetRule => {
      if (
        typeof rule === 'object' &&
        rule !== null &&
        'test' in rule &&
        rule.test instanceof RegExp &&
        (rule as RuleSetRule).test !== undefined && // Explicit check for undefined
        rule.test instanceof RegExp && rule.test.test('.(png|jpg|jpeg|gif|webp|avif)(?!\\.svg)$')
      ) {
        return true;
      }
      return false;
    }) as RuleSetRule | undefined;

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
    } as RuleSetRule);

    return config;
  },
};

export default nextConfig;