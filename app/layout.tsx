/* eslint-disable @typescript-eslint/no-unused-vars */
import type React from 'react';
import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/lib/site-config';
import { withBasePath } from '@/lib/base-path';
import {
    Geist_Mono,
    DM_Sans as V0_Font_DM_Sans,
    Geist_Mono as V0_Font_Geist_Mono,
    EB_Garamond as V0_Font_EB_Garamond,
} from 'next/font/google';
import { MDXReloadClient } from './mdx-reload';
import './globals.css';

// Initialize fonts
const dmSans = V0_Font_DM_Sans({
    subsets: ['latin'],
    weight: [
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        '1000',
    ],
});
const geistMono = V0_Font_Geist_Mono({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const ebGaramond = V0_Font_EB_Garamond({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: `${siteConfig.name} - ${siteConfig.title}`,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    icons: {
        icon: [
            {
                url: withBasePath('/images/icons/favicon-32x32.png'),
                sizes: '32x32',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-48x48.png'),
                sizes: '48x48',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-72x72.png'),
                sizes: '72x72',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-96x96.png'),
                sizes: '96x96',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-144x144.png'),
                sizes: '144x144',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-192x192.png'),
                sizes: '192x192',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-256x256.png'),
                sizes: '256x256',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-384x384.png'),
                sizes: '384x384',
                type: 'image/png',
            },
            {
                url: withBasePath('/images/icons/icon-512x512.png'),
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        apple: [
            {
                url: '/images/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
        ],
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
        creator: siteConfig.author.twitter,
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        types: {
            'application/rss+xml': '/rss.xml',
        },
    },
    generator: 'v0.app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
                <Analytics />
                {process.env.NODE_ENV === 'development' && <MDXReloadClient />}
            </body>
        </html>
    );
}
