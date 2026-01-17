import { ImageResponse } from 'next/og';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { siteConfig } from '@/lib/site-config';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map(post => ({
        slug: post.slug,
    }));
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const post = getPostBySlug(slug.split('.')[0]);

    if (!post) {
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
                    {post.title}
                </div>
                <div
                    style={{
                        fontSize: '24px',
                        maxWidth: '800px',
                        marginTop: '12px',
                    }}
                >
                    {post.description}
                </div>
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
                        {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                </div>
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
