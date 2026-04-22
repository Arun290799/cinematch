import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable strict mode for better performance and error handling
	reactStrictMode: true,

	// Image domains
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
				port: "",
				pathname: "/t/p/**",
			},
		],
	},

	// Security headers
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},

	// Compression
	compress: true,

	// Power by header removal
	poweredByHeader: false,

	// Generate source maps for production (optional)
	productionBrowserSourceMaps: false,
};

export default nextConfig;
