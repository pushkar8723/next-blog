import type { Metadata } from 'next';
import { ExternalLink, Github } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Projects',
    description: "A collection of projects I've worked on.",
};

const projects = [
    {
        title: 'Project One',
        description:
            'A full-stack web application built with Next.js and TypeScript. Features include authentication, real-time updates, and a modern UI.',
        tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
        github: '#',
        demo: '#',
    },
    {
        title: 'Project Two',
        description:
            'An open-source library for building accessible React components. Follows WAI-ARIA guidelines and supports keyboard navigation.',
        tags: ['React', 'Accessibility', 'TypeScript', 'Storybook'],
        github: '#',
        demo: '#',
    },
    {
        title: 'Project Three',
        description:
            'A CLI tool for automating development workflows. Supports multiple templates and integrates with popular tools.',
        tags: ['Node.js', 'CLI', 'Automation', 'Open Source'],
        github: '#',
    },
    {
        title: 'Project Four',
        description:
            'A design system built with React and Tailwind CSS. Includes a comprehensive component library and documentation.',
        tags: ['React', 'Design System', 'Tailwind CSS', 'Figma'],
        github: '#',
        demo: '#',
    },
    {
        title: 'Project Five',
        description:
            'A real-time collaboration tool built with WebSockets. Features include live cursors, presence indicators, and conflict resolution.',
        tags: ['WebSockets', 'Real-time', 'React', 'Node.js'],
        github: '#',
        demo: '#',
    },
    {
        title: 'Project Six',
        description:
            'A mobile-first progressive web app with offline support. Built with service workers and IndexedDB for data persistence.',
        tags: ['PWA', 'Service Workers', 'IndexedDB', 'React'],
        github: '#',
    },
];

export default function ProjectsPage() {
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
                    <Card key={project.title} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {project.title}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {project.description}
                            </CardDescription>
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
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Github className="mr-2 h-4 w-4" />
                                            Code
                                        </a>
                                    </Button>
                                )}
                                {project.demo && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={project.demo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Demo
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
