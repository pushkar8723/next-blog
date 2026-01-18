import { siteConfig } from '@/lib/site-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import {
    faFacebook,
    faGithub,
    faInstagram,
    faLinkedin,
    faXTwitter,
} from '@fortawesome/free-brands-svg-icons';

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted">
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex gap-3">
                        <a
                            href={siteConfig.links.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Facebook"
                        >
                            <FontAwesomeIcon
                                icon={faFacebook}
                                className="w-4"
                                aria-hidden="true"
                            />
                        </a>
                        <a
                            href={siteConfig.links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="Instagram"
                        >
                            <FontAwesomeIcon
                                icon={faInstagram}
                                className="w-4"
                                aria-hidden="true"
                            />
                        </a>
                        <a
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="X (Formerly Twitter)"
                        >
                            <FontAwesomeIcon
                                icon={faXTwitter}
                                className="w-4"
                                aria-hidden="true"
                            />
                        </a>
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="GitHub"
                        >
                            <FontAwesomeIcon
                                icon={faGithub}
                                className="w-4"
                                aria-hidden="true"
                            />
                        </a>
                        <a
                            href={siteConfig.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="LinkedIn"
                        >
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                className="w-4"
                                aria-hidden="true"
                            />
                        </a>
                        <a
                            href="/rss.xml"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            aria-label="RSS Feed"
                        >
                            <FontAwesomeIcon
                                icon={faRss}
                                className="w-4"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        © {new Date().getFullYear()} {siteConfig.name}. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
