import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPages, getPageBySlug } from '@/lib/pages';
import { siteConfig } from '@/lib/site-config';
import { parseMarkdown } from '@/lib/markdown';
import { TableOfContents } from '@/components/table-of-contents';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const pages = getAllPages();
    return pages.map(page => ({
        slug: page.slug,
    }));
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = getPageBySlug(slug);

    if (!page) {
        return {};
    }

    const ogImageUrl = `${siteConfig.url}/og/page-${page.slug}.jpg`;

    return {
        title: page.title,
        description: page.description,
        alternates:
            siteConfig.canonicalUrl &&
            siteConfig.canonicalUrl !== siteConfig.url
                ? {
                      canonical: `${siteConfig.canonicalUrl}/${page.slug}`,
                  }
                : undefined,
        openGraph: {
            type: 'article',
            title: page.title,
            description: page.description,
            url: `${siteConfig.url}/${page.slug}`,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: page.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title,
            description: page.description,
            images: [ogImageUrl],
            creator: siteConfig.author.twitter,
        },
    };
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const page = getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    const htmlContent = await parseMarkdown(page.content);

    return (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12 xl:grid-cols-[1fr_250px]">
                <article className="min-w-0">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {page.title}
                        </h1>
                        {page.description && (
                            <p className="mt-4 text-lg text-muted-foreground">
                                {page.description}
                            </p>
                        )}
                    </header>

                    <div
                        className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </article>

                {page.headings.length > 0 && (
                    <aside className="hidden lg:block">
                        <div className="sticky top-20">
                            <TableOfContents headings={page.headings} />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
