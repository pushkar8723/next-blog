import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    keywords: string[];
    readingTime: string;
    content: string;
    headings: { id: string; text: string; level: number }[];
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export function getPostSlugs(): string[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }
    // In development, always read fresh from disk
    const files = fs.readdirSync(postsDirectory);
    return files.filter(file => file.endsWith('.mdx'));
}

export function getPostBySlug(slug: string): BlogPost | null {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    // Force fresh read in development
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract headings for table of contents
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        headings.push({ id, text, level });
    }

    const stats = readingTime(content);

    return {
        slug: realSlug,
        title: data.title || 'Untitled',
        description: data.description || '',
        date: data.date
            ? new Date(data.date).toISOString()
            : new Date().toISOString(),
        author: data.author || 'Anonymous',
        keywords: data.keywords?.split(/,\s*/) || [],
        readingTime: stats.text,
        content,
        headings,
    };
}

export function getAllPosts(): BlogPost[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map(slug => getPostBySlug(slug.replace(/\.mdx$/, '')))
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));

    return posts;
}
