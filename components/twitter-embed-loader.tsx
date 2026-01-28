'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        twttr?: {
            widgets?: {
                load: () => void;
            };
            ready?: (callback: () => void) => void;
        };
    }
}

export default function TwitterEmbedLoader() {
    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const loadWidgets = () => {
            if (window.twttr?.widgets) {
                window.twttr.widgets.load();
            }
        };

        // If twitter tweet is not present, return
        const twitterTweet = document.querySelector('blockquote.twitter-tweet');
        if (!twitterTweet) {
            return undefined;
        }

        // If Twitter script is already fully loaded, call load immediately
        if (window.twttr?.widgets) {
            loadWidgets();
            return undefined;
        }

        // If twttr exists but widgets isn't ready yet, use the ready callback
        if (window.twttr?.ready) {
            window.twttr.ready(loadWidgets);
            return undefined;
        }

        // Load the Twitter widget script dynamically if not present
        const existingScript = document.querySelector(
            'script[src="https://platform.twitter.com/widgets.js"]'
        );

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';
            script.onload = () => {
                // Wait for twttr to be ready after script loads
                if (window.twttr?.ready) {
                    window.twttr.ready(loadWidgets);
                } else {
                    // Fallback: poll for twttr.widgets
                    const maxAttempts = 20;
                    let attempts = 0;
                    const interval = setInterval(() => {
                        attempts += 1;
                        if (window.twttr?.widgets) {
                            loadWidgets();
                            clearInterval(interval);
                        } else if (attempts >= maxAttempts) {
                            clearInterval(interval);
                        }
                    }, 250);
                }
            };
            document.body.appendChild(script);
        }

        return undefined;
    }, []);

    return null;
}
