import remarkGfm from "remark-gfm"
import rehypeShiki from "rehype-shiki"

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    mdxRs: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: "next-mdx-remote/esm/loader",
          options: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeShiki],
          },
        },
      ],
    })
    return config
  },
  turbopack: {},
}

export default nextConfig
