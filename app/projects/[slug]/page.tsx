import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';
import { siteConfig } from '@/lib/site-config';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/markdown';
import Bio from '@/components/bio';
import GitHubButton from '@/components/ui/githubButton';

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const projects = getAllProjects();
    return projects.map(project => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        return {};
    }

    const ogImageUrl = `${siteConfig.url}/og/project-${project.slug}.jpg`;

    return {
        title: project.title,
        description: project.description,
        alternates:
            siteConfig.canonicalUrl &&
            siteConfig.canonicalUrl !== siteConfig.url
                ? {
                      canonical: `${siteConfig.canonicalUrl}/projects/${project.slug}`,
                  }
                : undefined,
        openGraph: {
            type: 'article',
            title: project.title,
            description: project.description,
            url: `${siteConfig.url}/projects/${project.slug}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: [ogImageUrl],
            creator: siteConfig.author.twitter,
        },
    };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const htmlContent = await parseMarkdown(project.content);

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <article className="mx-auto max-w-3xl">
                <Link
                    href="/projects"
                    className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to projects
                </Link>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {project.title}
                    </h1>
                    <p
                        className="mt-4 text-lg text-muted-foreground"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                            __html: project.description,
                        }}
                    />

                    {project.github && (
                        <div className="mt-4">
                            <GitHubButton repo={project.github} />
                        </div>
                    )}

                    {project.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </header>

                <div
                    className="prose max-w-none"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                <hr className="my-12 border-border" />

                <Bio />
            </article>
        </div>
    );
}
