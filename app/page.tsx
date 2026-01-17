import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Twitter } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site-config';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const projects = [
    {
        title: 'Project One',
        description:
            'A full-stack web application built with Next.js and TypeScript.',
        tags: ['Next.js', 'TypeScript', 'Tailwind'],
        link: '#',
    },
    {
        title: 'Project Two',
        description:
            'An open-source library for building accessible React components.',
        tags: ['React', 'Accessibility', 'Open Source'],
        link: '#',
    },
    {
        title: 'Project Three',
        description: 'A CLI tool for automating development workflows.',
        tags: ['Node.js', 'CLI', 'Automation'],
        link: '#',
    },
];

export default function HomePage() {
    const posts = getAllPosts().slice(0, 3);

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-24">
            {/* Hero Section */}
            <section className="mb-20">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {siteConfig.name}
                </h1>
                <p className="mt-2 text-xl text-primary">{siteConfig.title}</p>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                    {siteConfig.description}
                </p>

                <div className="mt-8 flex items-center gap-4">
                    <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Github className="h-5 w-5" />
                        <span className="text-sm">GitHub</span>
                    </a>
                    <a
                        href={siteConfig.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Twitter className="h-5 w-5" />
                        <span className="text-sm">Twitter</span>
                    </a>
                    <a
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-sm">LinkedIn</span>
                    </a>
                </div>
            </section>

            {/* Recent Writing Section */}
            <section className="mb-20">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        Recent Writing
                    </h2>
                    <Link href="/blog">
                        <Button variant="ghost" size="sm">
                            View all <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group block"
                            >
                                <article className="flex flex-col gap-2 rounded-lg border border-transparent p-4 transition-colors hover:border-border hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="font-medium text-foreground group-hover:text-primary">
                                            {post.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {post.description}
                                        </p>
                                    </div>
                                    <time className="shrink-0 text-sm text-muted-foreground">
                                        {new Date(post.date).toLocaleDateString(
                                            'en-US',
                                            {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }
                                        )}
                                    </time>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        No posts yet. Add MDX files to{' '}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                            content/blog/
                        </code>{' '}
                        to get started.
                    </p>
                )}
            </section>

            {/* Projects Section */}
            <section>
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        Projects
                    </h2>
                    <Link href="/projects">
                        <Button variant="ghost" size="sm">
                            View all <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map(project => (
                        <Card
                            key={project.title}
                            className="group transition-colors hover:border-primary/50"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg group-hover:text-primary">
                                    {project.title}
                                </CardTitle>
                                <CardDescription>
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
