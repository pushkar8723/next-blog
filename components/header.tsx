import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
                <Link
                    href="/"
                    className="font-semibold text-foreground transition-colors hover:text-primary"
                >
                    {siteConfig.name}
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>
                    <Link
                        href="/blog"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Blog
                    </Link>
                    <Link
                        href="/projects"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Projects
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        About
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href={siteConfig.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Twitter"
                    >
                        <Twitter className="h-4 w-4" />
                    </a>
                    <a
                        href={siteConfig.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="GitHub"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                    <a
                        href={siteConfig.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="h-4 w-4" />
                    </a>
                </div>
            </div>
        </header>
    );
}
