import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Page {
    slug: string;
    title: string;
    description: string;
    priority: number;
    content: string;
    headings: { id: string; text: string; level: number }[];
}

const pagesDirectory = path.join(process.cwd(), 'content');

export function getPageSlugs(): string[] {
    if (!fs.existsSync(pagesDirectory)) {
        return [];
    }
    // In development, always read fresh from disk
    const files = fs.readdirSync(pagesDirectory);
    // Only get MDX files from the root content directory (not subdirectories)
    return files.filter(
        file =>
            file.endsWith('.mdx') &&
            fs.statSync(path.join(pagesDirectory, file)).isFile()
    );
}

export function getPageBySlug(slug: string): Page | null {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(pagesDirectory, `${realSlug}.mdx`);

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
            .replace(/`([^`]*)`/g, '$1')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        headings.push({ id, text, level });
    }

    return {
        slug: realSlug,
        title: data.title || 'Untitled',
        description: data.description || '',
        priority: Number(data.priority) || 0,
        content,
        headings,
    };
}

export function getAllPages(): Page[] {
    const slugs = getPageSlugs();
    const pages = slugs
        .map(slug => getPageBySlug(slug.replace(/\.mdx$/, '')))
        .filter((page): page is Page => page !== null)
        .sort((a, b) => b.priority - a.priority);

    return pages;
}
