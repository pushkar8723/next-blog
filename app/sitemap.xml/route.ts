import { getAllPosts } from '@/lib/blog';
import { getAllProjects } from '@/lib/projects';
import { getAllPages } from '@/lib/pages';
import { siteConfig } from '@/lib/site-config';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

function getFileModifiedDate(filePath: string): string {
    try {
        const stats = fs.statSync(filePath);
        return stats.mtime.toISOString();
    } catch (error) {
        // Fallback to build time if file not found
        return new Date().toISOString();
    }
}

export async function GET() {
    const posts = getAllPosts();
    const projects = getAllProjects();
    const pages = getAllPages();

    const buildDate = new Date().toISOString();

    // Homepage - use build time
    const homeUrl = `
  <url>
    <loc>${siteConfig.url}/</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Blog listing page - use build time
    const blogListingUrl = `
  <url>
    <loc>${siteConfig.url}/blog</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Projects listing page - use build time
    const projectsListingUrl = `
  <url>
    <loc>${siteConfig.url}/projects</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;

    // Blog posts - use file modification time or post date, whichever is more recent
    const postUrls = posts
        .map(post => {
            const filePath = path.join(
                process.cwd(),
                'content/blog',
                `${post.slug}.mdx`
            );
            const fileModDate = getFileModifiedDate(filePath);
            const postDate = new Date(post.date).toISOString();
            // Use whichever is more recent: file modification or post date
            const lastmod =
                new Date(fileModDate) > new Date(postDate)
                    ? fileModDate
                    : postDate;

            return `
  <url>
    <loc>${siteConfig.url}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
        .join('');

    // Project pages - use file modification time
    const projectUrls = projects
        .map(project => {
            const filePath = path.join(
                process.cwd(),
                'content/projects',
                `${project.slug}.mdx`
            );
            const lastmod = getFileModifiedDate(filePath);

            return `
  <url>
    <loc>${siteConfig.url}/projects/${project.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        })
        .join('');

    // Other pages - use file modification time
    const pageUrls = pages
        .map(page => {
            const filePath = path.join(
                process.cwd(),
                'content',
                `${page.slug}.mdx`
            );
            const lastmod = getFileModifiedDate(filePath);

            return `
  <url>
    <loc>${siteConfig.url}/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        })
        .join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${homeUrl}${blogListingUrl}${projectsListingUrl}${postUrls}${projectUrls}${pageUrls}
</urlset>`;

    return new Response(sitemap.trim(), {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
