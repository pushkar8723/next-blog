import remarkGfm from 'remark-gfm';
import rehypeShiki from 'rehype-shiki';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Only use static export for production builds
    ...(isDev ? {} : { output: 'export' }),
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        mdxRs: true,
        // Enable Turbopack watch for content directory
        turbo: {
            rules: {
                '*.mdx': {
                    loaders: ['next-mdx-remote/esm/loader'],
                    as: '*.js',
                },
            },
        },
    },
};

export default nextConfig;
