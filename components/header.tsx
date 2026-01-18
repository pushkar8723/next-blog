'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import Image from 'next/image';
import { withBasePath } from '@/lib/base-path';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { href: '/blog', label: 'Blog' },
        { href: '/projects', label: 'Projects' },
        { href: '/work-ex', label: 'Experience' },
        { href: '/about-me', label: 'About' },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex px-4 sm:px-6 h-16 max-w-5xl items-center justify-between sm:justify-start gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-semibold text-foreground transition-colors hover:text-primary"
                >
                    <Image
                        src={withBasePath('/images/icons/icon-256x256.png')}
                        alt={`${siteConfig.name} logo`}
                        width={32}
                        height={32}
                        priority
                        sizes="32px"
                    />
                    <span>{siteConfig.name}</span>
                </Link>

                {/* Desktop navigation */}
                <nav
                    className="hidden sm:flex gap-6"
                    aria-label="navigation links"
                >
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile navigation popover */}
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger
                        className="sm:hidden p-2 text-muted-foreground hover:text-foreground"
                        aria-label="Toggle menu"
                        suppressHydrationWarning
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-48">
                        <nav className="flex flex-col gap-3">
                            {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground py-1"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </PopoverContent>
                </Popover>
            </div>
        </header>
    );
}
