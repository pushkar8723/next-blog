'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function MDXReloadClient() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            return undefined;
        }

        const eventSource = new EventSource('/api/mdx-watch');

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);

            if (data.type === 'change') {
                // Only reload if we're on a blog post page
                if (
                    pathname.startsWith('/blog/') ||
                    pathname.startsWith('/projects/')
                ) {
                    router.refresh();
                }
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [router, pathname]);

    return null;
}
