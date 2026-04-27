/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    compiler: {
        styledComponents: true
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        
        unoptimized: true, 
    },
   
    serverExternalPackages: ["sharp"],
   
    rewrites: async function() {
        return [
            {
                source: "/remote-api/:path*",
                destination: "https://admin.unicodeconverter.info/:path*",
            },
        ];
    },
};

module.exports = nextConfig;