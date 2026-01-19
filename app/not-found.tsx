import Link from 'next/link';
import NotFoundImg from '@/components/ui/notFoundImg';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center px-4 py-16 min-h-[calc(100vh-theme(spacing.16)-65px)]">
            <div className="max-w-5xl w-full text-center space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-12">
                    <div className="text-primary flex-shrink-0 w-full sm:w-1/2">
                        <NotFoundImg style={{ maxWidth: '100%' }} />
                    </div>
                    <div className="space-y-4 sm:text-left">
                        <h1 className="text-3xl font-semibold text-foreground">
                            Page Not Found
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Sorry, the page you&apos;re looking for doesn&apos;t
                            exist or has been moved.
                        </p>
                        <div className="flex justify-center sm:justify-start gap-4">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                Go Home
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                View Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
