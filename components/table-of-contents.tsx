'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        );

        headings.forEach(heading => {
            const element = document.getElementById(heading.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length === 0) {
        return null;
    }

    return (
        <nav className="hidden xl:block" aria-label="Table of contents">
            <div className="sticky top-24">
                <h4 className="mb-4 text-sm font-semibold text-foreground">
                    On this page
                </h4>
                <ul className="space-y-2 text-sm">
                    {headings.map(heading => (
                        <li
                            key={heading.id}
                            style={{
                                paddingLeft: `${(heading.level - 1) * 12}px`,
                            }}
                        >
                            <a
                                href={`#${heading.id}`}
                                className={cn(
                                    'block text-muted-foreground transition-colors hover:text-foreground',
                                    activeId === heading.id &&
                                        'font-medium text-primary'
                                )}
                                onClick={e => {
                                    e.preventDefault();
                                    const element = document.getElementById(
                                        heading.id
                                    );
                                    if (element) {
                                        element.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                        setActiveId(heading.id);
                                    }
                                }}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
