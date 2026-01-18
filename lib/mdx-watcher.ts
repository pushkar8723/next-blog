/* eslint-disable no-console */
import { watch } from 'fs';
import { join } from 'path';

let isWatching = false;

export function setupMDXWatcher() {
    // Only run in development and only once
    if (process.env.NODE_ENV !== 'development' || isWatching) {
        return;
    }

    isWatching = true;
    const contentDir = join(process.cwd(), 'content/blog');

    console.log('👀 Watching MDX files for changes...');

    watch(contentDir, { recursive: true }, (eventType, filename) => {
        if (filename?.endsWith('.mdx')) {
            console.log(`📝 MDX file changed: ${filename}`);
            // Force router refresh on the client
            if (typeof window !== 'undefined') {
                window.location.reload();
            }
        }
    });
}
