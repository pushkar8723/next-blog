import { watch } from 'fs';
import { join } from 'path';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    if (process.env.NODE_ENV !== 'development') {
        return new Response('Not available in production', { status: 404 });
    }

    const encoder = new TextEncoder();
    const contentDir = join(process.cwd(), 'content/blog');

    const stream = new ReadableStream({
        start(controller) {
            // Send initial connection message
            controller.enqueue(
                encoder.encode(
                    `data: ${JSON.stringify({ type: 'connected' })}\n\n`
                )
            );

            // Watch for MDX file changes
            const watcher = watch(
                contentDir,
                { recursive: true },
                (eventType, filename) => {
                    if (filename?.endsWith('.mdx')) {
                        // eslint-disable-next-line no-console
                        console.log(`📝 MDX file changed: ${filename}`);
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({ type: 'change', filename })}\n\n`
                            )
                        );
                    }
                }
            );

            // Clean up watcher when connection closes
            request.signal.addEventListener('abort', () => {
                watcher.close();
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
