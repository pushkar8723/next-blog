import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllProjects } from '@/lib/projects';
import GitHubButton from '@/components/ui/githubButton';
import { siteConfig } from '@/lib/site-config';

const ogImageUrl = `${siteConfig.url}/og/projects.jpg`;

export const metadata: Metadata = {
    title: 'Projects',
    description:
        "A collection of projects I've worked on. Some are open source, some are experiments.",
    alternates:
        siteConfig.canonicalUrl && siteConfig.canonicalUrl !== siteConfig.url
            ? {
                  canonical: `${siteConfig.canonicalUrl}/projects`,
              }
            : undefined,
    openGraph: {
        type: 'article',
        title: 'Projects',
        description:
            "A collection of projects I've worked on. Some are open source, some are experiments.",
        url: `${siteConfig.url}/projects`,
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: 'Projects',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Projects',
        description:
            "A collection of projects I've worked on. Some are open source, some are experiments.",
        images: [ogImageUrl],
        creator: siteConfig.author.twitter,
    },
};

export default function ProjectsPage() {
    const projects = getAllProjects();
    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Projects
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    A collection of projects I&apos;ve worked on. Some are open
                    source, some are experiments.
                </p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2">
                {projects.map(project => (
                    <Card key={project.slug} className="flex flex-col">
                        <CardHeader>
                            <Link href={`/projects/${project.slug}`}>
                                <CardTitle className="text-xl hover:text-primary transition-colors">
                                    {project.title}
                                </CardTitle>
                            </Link>
                            <CardDescription
                                className="text-base"
                                dangerouslySetInnerHTML={{
                                    __html: project.description,
                                }}
                            />
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <div className="mb-4 flex flex-wrap gap-2">
                                {project.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                {project.github && (
                                    <GitHubButton repo={project.github} />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
