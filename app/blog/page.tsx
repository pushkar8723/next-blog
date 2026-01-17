import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Thoughts on development, design, and technology.',
};

// Force revalidation on every request in development
export const revalidate = 0;

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <header className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Blog
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Thoughts on development, design, and technology.
                </p>
            </header>

            {posts.length > 0 ? (
                <div className="space-y-8">
                    {posts.map(post => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="rounded-lg border border-transparent p-6 transition-colors hover:border-border hover:bg-muted/50">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
                                            {post.title}
                                        </h2>
                                        <p className="mt-2 text-muted-foreground">
                                            {post.description}
                                        </p>
                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            {post.tags.slice(0, 3).map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end text-sm text-muted-foreground">
                                        <time>
                                            {new Date(
                                                post.date
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                        <span className="mt-1">
                                            {post.readingTime}
                                        </span>
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
