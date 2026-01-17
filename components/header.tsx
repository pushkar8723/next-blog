import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-start gap-6">
                <Link
                    href="/"
                    className="font-semibold text-foreground transition-colors hover:text-primary"
                >
                    {siteConfig.name}
                </Link>

                <nav className="flex gap-6">
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
            </div>
        </header>
    );
}
