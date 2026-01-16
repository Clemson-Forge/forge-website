import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "github.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "burwnknbiselmqvbjkoz.supabase.co",
				pathname: "/storage/v1/object/public/profile-photos/**",
			},
		],
	},
};

export default nextConfig;
