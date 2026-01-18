import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { getAllProjects } from '@/lib/projects';
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
import Bio from '@/components/bio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faGithub,
    faInstagram,
    faLinkedin,
    faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { Metadata } from 'next';
import './home.css';
import { withBasePath } from '@/lib/base-path';

const ogImageUrl = `${siteConfig.url}/og/home.jpg`;
const heroImageUrl = withBasePath('/images/hero-image.jpg');

export const metadata: Metadata = {
    title: 'Home',
    description: 'Welcome to portfolio.',
    alternates:
        siteConfig.canonicalUrl && siteConfig.canonicalUrl !== siteConfig.url
            ? {
                  canonical: siteConfig.canonicalUrl,
              }
            : undefined,
    openGraph: {
        type: 'article',
        title: 'Home',
        description: 'Welcome to portfolio.',
        url: `${siteConfig.url}/`,
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: 'Home',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Home',
        description: 'Welcome to portfolio.',
        images: [ogImageUrl],
        creator: siteConfig.author.twitter,
    },
    other: {
        'link-preload-hero': `<${heroImageUrl}>; rel=preload; as=image; fetchpriority=high`,
    },
};

export default function HomePage() {
    const posts = getAllPosts().slice(0, 3);
    const projects = getAllProjects().slice(0, 3);

    return (
        <>
            <link
                rel="preload"
                as="image"
                href={withBasePath('/images/hero-image.jpg')}
                fetchPriority="high"
            />
            {/* Hero Section */}
            <section
                className="hero-container py-16 lg:py-24 border-b border-border"
                style={
                    {
                        '--hero-image': `url('${withBasePath('/images/hero-image.jpg')}')`,
                    } as React.CSSProperties
                }
            >
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {siteConfig.name}
                    </h1>
                    <Bio />

                    <div className="mt-8 flex items-center gap-4 flex-wrap">
                        <a
                            href={siteConfig.links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faFacebook}
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                            <span className="text-sm">Facebook</span>
                        </a>
                        <a
                            href={siteConfig.links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faInstagram}
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                            <span className="text-sm">Instagram</span>
                        </a>
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faGithub}
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                            <span className="text-sm">GitHub</span>
                        </a>
                        <a
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faXTwitter}
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                            <span className="text-sm">
                                X (formerly Twitter)
                            </span>
                        </a>
                        <a
                            href={siteConfig.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                            <span className="text-sm">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </section>
            <div className="mx-auto max-w-5xl pb-16 px-4 py-16">
                {/* Recent Writing Section */}
                <section className="mb-20">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                            Recent Writing
                        </h2>
                        <Link href="/blog">
                            <Button variant="ghost" size="sm">
                                View all <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {posts.length > 0 ? (
                        <div className="space-y-12">
                            {posts.map(post => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group block"
                                >
                                    <article className="flex flex-col gap-2 rounded-lg border border-transparent transition-colors">
                                        <div>
                                            <h3 className="font-bold text-primary text-xl">
                                                {post.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {post.description}
                                            </p>
                                        </div>
                                        <div className="flex text-sm text-muted-foreground">
                                            <time className="shrink-0">
                                                {new Date(
                                                    post.date
                                                ).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                            <span className="mx-2">{` • `}</span>
                                            <span>{post.readingTime}</span>
                                        </div>
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
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
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
                            <Link
                                key={project.slug}
                                href={`/projects/${project.slug}`}
                            >
                                <Card className="group transition-colors hover:border-primary/50 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg group-hover:text-primary">
                                            {project.title}
                                        </CardTitle>
                                        <CardDescription
                                            dangerouslySetInnerHTML={{
                                                __html: project.description,
                                            }}
                                        />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tags.map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
