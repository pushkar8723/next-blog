import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/lib/site-config';

const ogImageUrl = `${siteConfig.url}/og/blog.jpg`;

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Thoughts on development, design, and technology.',
    openGraph: {
        type: 'article',
        title: 'Blog',
        description: 'My thoughts on development, design, and technology.',
        url: `${siteConfig.url}/blog`,
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: 'Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog',
        description: 'My thoughts on development, design, and technology.',
        images: [ogImageUrl],
        creator: siteConfig.author.twitter,
    },
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Blog
                </h1>
            </header>

            {posts.length > 0 ? (
                <div className="max-w-3xl">
                    {posts.map(post => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block mb-16"
                        >
                            <article className="rounded-lg border border-transparent transition-colors">
                                <div className="flex flex-col gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-semibold text-foreground text-primary">
                                            {post.title}
                                        </h2>
                                        <p className="mt-2 text-foreground">
                                            {post.description}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 flex-row text-sm text-muted-foreground">
                                        <time>
                                            {new Date(
                                                post.date
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                        <span className="mx-2">{` • `}</span>
                                        <span>{post.readingTime}</span>
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {post.keywords.map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                    <p className="text-muted-foreground">
                        No posts yet. Create MDX files in{' '}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
                            content/blog/
                        </code>{' '}
                        to get started.
                    </p>
                </div>
            )}
        </div>
    );
}
