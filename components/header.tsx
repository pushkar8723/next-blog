import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';
import Image from 'next/image';

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto flex px-4 sm:px-6 h-16 max-w-5xl items-center justify-start gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-semibold text-foreground transition-colors hover:text-primary"
                >
                    <Image
                        src="/images/icons/icon-256x256.png"
                        alt={`${siteConfig.name} logo`}
                        width={32}
                        height={32}
                        priority
                        sizes="32px"
                    />
                    <span className="hidden sm:inline">{siteConfig.name}</span>
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
                        href="/work-ex"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Experience
                    </Link>
                    <Link
                        href="/about-me"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
}
