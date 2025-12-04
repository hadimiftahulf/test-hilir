import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["typeorm"],

  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        minimizer: config.optimization.minimizer?.map((minimizer: any) => {
          if (minimizer.constructor.name === "TerserPlugin") {
            minimizer.options = {
              ...minimizer.options,
              terserOptions: {
                ...minimizer.options?.terserOptions,
                keep_classnames: true,
                keep_fnames: true,
              },
            };
          }
          return minimizer;
        }),
      };

      config.externals = [
        ...(config.externals || []),
        "typeorm",
        "reflect-metadata",
      ];
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
