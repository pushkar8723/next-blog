'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/site-config';

export function Giscus() {
    const ref = useRef<HTMLDivElement>(null);
    const giscusConfig = siteConfig.comments?.giscus;

    useEffect(() => {
        if (
            !ref.current ||
            ref.current.hasChildNodes() ||
            !giscusConfig ||
            !giscusConfig.enabled
        )
            return;

        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.setAttribute('data-repo', giscusConfig.repo);
        script.setAttribute('data-repo-id', giscusConfig.repoId);
        script.setAttribute('data-category', giscusConfig.category);
        script.setAttribute('data-category-id', giscusConfig.categoryId);
        script.setAttribute('data-mapping', giscusConfig.mapping);
        script.setAttribute('data-strict', giscusConfig.strict);
        script.setAttribute(
            'data-reactions-enabled',
            giscusConfig.reactionsEnabled
        );
        script.setAttribute('data-emit-metadata', giscusConfig.emitMetadata);
        script.setAttribute('data-input-position', giscusConfig.inputPosition);
        script.setAttribute('data-theme', giscusConfig.theme);
        script.setAttribute('data-lang', giscusConfig.lang);
        script.setAttribute('data-loading', giscusConfig.loading);
        script.crossOrigin = 'anonymous';
        script.async = true;

        ref.current.appendChild(script);
    }, [giscusConfig]);

    if (!giscusConfig || !giscusConfig.enabled) {
        return null;
    }

    return <div ref={ref} className="giscus" />;
}
