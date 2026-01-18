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
                        >
                            <FontAwesomeIcon
                                icon={faFacebook}
                                className="w-4"
                                aria-label="Facebook"
                            />
                        </a>
                        <a
                            href={siteConfig.links.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faInstagram}
                                className="w-4"
                                aria-label="Instagram"
                            />
                        </a>
                        <a
                            href={siteConfig.links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faXTwitter}
                                className="w-4"
                                aria-label="X (Formerly Twitter)"
                            />
                        </a>
                        <a
                            href={siteConfig.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faGithub}
                                className="w-4"
                                aria-label="GitHub"
                            />
                        </a>
                        <a
                            href={siteConfig.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                className="w-4"
                                aria-label="LinkedIn"
                            />
                        </a>
                        <a
                            href="/rss.xml"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <FontAwesomeIcon
                                icon={faRss}
                                className="w-4"
                                aria-label="RSS"
                            />
                        </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {siteConfig.name}. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
