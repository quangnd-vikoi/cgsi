import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// output: "export",
	basePath: "/portal",
	assetPrefix: "/portal/",
	trailingSlash: true,

	env: {
		NEXT_PUBLIC_BASE_PATH: "/portal",
	},

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
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.cgsi.com.sg",
			},
		],
	},
};

export default nextConfig;
