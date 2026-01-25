import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Project {
    slug: string;
    title: string;
    description: string;
    github: string;
    priority: number;
    tags: string[];
    content: string;
    headings: { id: string; text: string; level: number }[];
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

export function getProjectSlugs(): string[] {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }
    // In development, always read fresh from disk
    const files = fs.readdirSync(projectsDirectory);
    return files.filter(file => file.endsWith('.mdx'));
}

export function getProjectBySlug(slug: string): Project | null {
    const realSlug = slug.replace(/\.mdx$/, '');
    const fullPath = path.join(projectsDirectory, `${realSlug}.mdx`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    // Force fresh read in development
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Extract headings for table of contents
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    const idCounts = new Map<string, number>();
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        let id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Handle duplicate IDs by appending a counter
        const baseId = id;
        const count = idCounts.get(baseId) || 0;
        if (count > 0) {
            id = `${baseId}-${count}`;
        }
        idCounts.set(baseId, count + 1);

        headings.push({ id, text, level });
    }

    return {
        slug: realSlug,
        title: data.title || 'Untitled',
        description: data.description || '',
        github: data.github || '',
        priority: Number(data.priority),
        tags: data.tags?.split(/,\s*/) || [],
        content,
        headings,
    };
}

export function getAllProjects(): Project[] {
    const slugs = getProjectSlugs();
    const projects = slugs
        .map(slug => getProjectBySlug(slug.replace(/\.mdx$/, '')))
        .filter((project): project is Project => project !== null)
        .sort((a, b) => b.priority - a.priority);

    return projects;
}
