import remarkGfm from 'remark-gfm';
import rehypeShiki from 'rehype-shiki';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
