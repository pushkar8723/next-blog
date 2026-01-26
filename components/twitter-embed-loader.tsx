'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        twttr?: {
            widgets?: {
                load: () => void;
            };
        };
    }
}

export default function TwitterEmbedLoader() {
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            window.twttr &&
            window.twttr.widgets
        ) {
            window.twttr.widgets.load();
        }
    }, []);
    return null;
}
