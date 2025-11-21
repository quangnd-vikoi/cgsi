import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			use: ["@svgr/webpack"],
		});

		return config;
	},

	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js",
			},
		},
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.cgsi.com.sg",
			},
		],
	},
};

export default nextConfig;
