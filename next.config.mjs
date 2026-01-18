import remarkGfm from 'remark-gfm';
import rehypeShiki from 'rehype-shiki';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: isDev ? undefined : 'export',
    basePath: process.env.BASE_PATH || '',
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
    experimental: {
        mdxRs: true,
    },
};

export default nextConfig;
