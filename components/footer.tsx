import { siteConfig } from "@/lib/site-config"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <a href="/rss.xml" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            RSS Feed
          </a>
        </div>
      </div>
    </footer>
  )
}
