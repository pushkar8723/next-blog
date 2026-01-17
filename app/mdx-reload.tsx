'use client';

/* eslint-disable no-console */
import { useEffect, useRef } from 'react';

export function MDXReloadClient() {
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            return undefined;
        }

        // Prevent multiple connections
        if (eventSourceRef.current) {
            return undefined;
        }

        // Set up EventSource to listen for file changes
        const eventSource = new EventSource('/api/mdx-watch');
        eventSourceRef.current = eventSource;

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            if (data.type === 'change') {
                console.log('📝 MDX file changed:', data.filename);

                // Only reload if we're on a blog page
                if (window.location.pathname.startsWith('/blog')) {
                    window.location.reload();
                }
            }
        };

        eventSource.onerror = error => {
            console.error('MDX watch error:', error);
            eventSource.close();
            eventSourceRef.current = null;
        };

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, []); // Empty dependency array - only set up once

    return null;
}
