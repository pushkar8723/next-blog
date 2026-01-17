import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { siteConfig } from '@/lib/site-config';
import { TableOfContents } from '@/components/table-of-contents';
import { Badge } from '@/components/ui/badge';
import { parseMarkdown } from '@/lib/markdown';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

// Force revalidation on every request in development
export const revalidate = 0;

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map(post => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {};
    }

    const ogImageUrl = `${siteConfig.url}/og/${post.slug}.jpg`;

    return {
        title: post.title,
        description: post.description,
        authors: [{ name: post.author }],
        openGraph: {
            type: 'article',
            title: post.title,
            description: post.description,
            url: `${siteConfig.url}/blog/${post.slug}`,
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description,
            images: [ogImageUrl],
            creator: siteConfig.author.twitter,
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const htmlContent = await parseMarkdown(post.content);

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12 xl:grid-cols-[1fr_250px]">
                <article className="min-w-0">
                    <Link
                        href="/blog"
                        className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to blog
                    </Link>

                    <header className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {post.title}
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            {post.description}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                <time dateTime={post.date}>
                                    {new Date(post.date).toLocaleDateString(
                                        'en-US',
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        }
                                    )}
                                </time>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>{post.readingTime}</span>
                            </div>
                        </div>

                        {post.keywords.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {post.keywords.map(keyword => (
                                    <Badge key={keyword} variant="secondary">
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </header>

                    <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </article>

                <aside className="mt-12 lg:sticky lg:top-24 lg:mt-0 lg:self-start">
                    <TableOfContents headings={post.headings} />
                </aside>
            </div>
        </div>
    );
}
