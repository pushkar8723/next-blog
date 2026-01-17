import { ImageResponse } from 'next/og';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { getProjectBySlug, getAllProjects } from '@/lib/projects';
import { siteConfig } from '@/lib/site-config';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function generateStaticParams() {
    const posts = getAllPosts();
    const projects = getAllProjects();

    const postParams = posts.map(post => ({
        slug: `blog-${post.slug}.jpg`,
    }));

    const projectParams = projects.map(project => ({
        slug: `project-${project.slug}.jpg`,
    }));

    // Add static pages
    const staticPages = [
        { slug: 'about.jpg' },
        { slug: 'blog.jpg' },
        { slug: 'projects.jpg' },
        { slug: 'home.jpg' },
    ];

    return [...postParams, ...projectParams, ...staticPages];
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const cleanSlug = slug.split('.')[0];

    let title = '';
    let description = '';
    let date = '';
    let readingTime = '';

    // Check if it's a blog post
    if (cleanSlug.startsWith('blog-')) {
        const postSlug = cleanSlug.replace('blog-', '');
        const post = getPostBySlug(postSlug);

        if (post) {
            title = post.title;
            description = post.description;
            date = post.date;
            readingTime = post.readingTime;
        }
    }
    // Check if it's a project
    else if (cleanSlug.startsWith('project-')) {
        const projectSlug = cleanSlug.replace('project-', '');
        const project = getProjectBySlug(projectSlug);

        if (project) {
            title = project.title;
            description = project.description;
        }
    }
    // Otherwise, it's a generic page
    else {
        // Capitalize and format the slug as title
        title = cleanSlug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        description = siteConfig.name;
    }

    if (!title) {
        return new Response('Not found', { status: 404 });
    }

    const templatePath = join(process.cwd(), 'public/images/twitter-card.jpg');
    const templateBuffer = readFileSync(templatePath);
    const templateBase64 = `data:image/jpeg;base64,${templateBuffer.toString('base64')}`;

    const imageResponse = new ImageResponse(
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                position: 'relative',
            }}
        >
            <img
                src={templateBase64 || '/placeholder.svg'}
                alt=""
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    color: '#000',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    padding: '60px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        fontSize: '56px',
                        fontWeight: 900,
                        lineHeight: 1.2,
                        maxWidth: '900px',
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: '24px',
                        maxWidth: '800px',
                        marginTop: '12px',
                    }}
                >
                    {description}
                </div>
                {date && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            marginTop: '24px',
                            fontSize: '18px',
                        }}
                    >
                        <span>
                            {new Date(date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                        {readingTime && (
                            <>
                                <span>•</span>
                                <span>{readingTime}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>,
        {
            width: 1200,
            height: 630,
        }
    );

    // Read the image bytes so we can set Content-Length and exact Content-Type.
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use the original content-type if available; otherwise assume PNG.
    const originalContentType =
        imageResponse.headers.get('content-type') || 'image/png';
    // Choose a sensible filename/extensions for Content-Disposition based on mime
    const ext =
        originalContentType.includes('jpeg') ||
        originalContentType.includes('jpg')
            ? 'jpg'
            : 'png';

    const headers = new Headers();
    headers.set('Content-Type', originalContentType);
    headers.set('Content-Disposition', `inline; filename="og.${ext}"`);
    headers.set('Content-Length', String(buffer.byteLength));
    // optional: caching
    headers.set(
        'Cache-Control',
        'public, max-age=3600, stale-while-revalidate=86400'
    );

    return new Response(buffer, {
        status: 200,
        headers,
    });
}
