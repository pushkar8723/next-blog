import { Marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';
import { getBasePath } from './base-path';

let highlighterPromise: Promise<Highlighter> | null = null;

async function getShikiHighlighter() {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            themes: ['dark-plus', 'light-plus'],
            langs: [
                'javascript',
                'typescript',
                'tsx',
                'jsx',
                'bash',
                'json',
                'css',
                'html',
                'markdown',
                'python',
                'go',
                'rust',
            ],
        });
    }
    return highlighterPromise;
}

export async function parseMarkdown(content: string): Promise<string> {
    const highlighter = await getShikiHighlighter();

    const marked = new Marked({
        async: true,
        gfm: true,
    });

    // Get base path for image URLs
    const basePath = getBasePath();

    // Custom renderer for code blocks with Shiki and images with basePath
    marked.use({
        renderer: {
            link({ href, title, text }) {
                // Prefix local links with basePath
                const finalHref =
                    href.startsWith('/') && basePath
                        ? `${basePath}${href}`
                        : href;
                const titleAttr = title ? ` title="${title}"` : '';
                const target = href.startsWith('http')
                    ? ' target="_blank" rel="noopener noreferrer"'
                    : '';
                return `<a href="${finalHref}"${titleAttr}${target}>${text}</a>`;
            },
            image({ href, title, text }) {
                // No optimization here - post-processor will handle it
                // Just prefix with basePath if needed
                const src =
                    href.startsWith('/') && basePath
                        ? `${basePath}${href}`
                        : href;

                // Parse title for dimensions, alignment, and loading (format: "width=350 height=350 center eager" or just "title text")
                let attributes = '';
                let styles = '';
                let hasProps = false;

                if (title) {
                    const widthMatch = title.match(/width=([\d%]+)/);
                    const heightMatch = title.match(/height=([\d%]+)/);
                    const centerMatch = title.match(/\bcenter\b/);
                    const eagerMatch = title.match(/\beager\b/);

                    if (widthMatch) {
                        attributes += ` width="${widthMatch[1]}"`;
                        hasProps = true;
                    }
                    if (heightMatch) {
                        attributes += ` height="${heightMatch[1]}"`;
                        hasProps = true;
                    }
                    if (centerMatch) {
                        styles = ' style="display: block; margin: 0 auto;"';
                        hasProps = true;
                    }
                    if (eagerMatch) {
                        attributes += ' loading="eager"';
                        hasProps = true;
                    }

                    // If title doesn't contain any props, treat it as actual title
                    if (!hasProps) {
                        attributes += ` title="${title}"`;
                    }
                }

                // Default to lazy loading unless eager is specified
                if (!attributes.includes('loading=')) {
                    attributes += ' loading="lazy"';
                }

                return `<img src="${src}" alt="${text}"${attributes}${styles} />`;
            },
            code({ text, lang }) {
                // Parse language and line highlighting syntax (e.g., "typescript{3-9}")
                const langMatch = lang?.match(/^(\w+)(?:\{([^}]+)\})?/);
                const language = langMatch?.[1].toLowerCase() || 'text';
                const highlightLines = langMatch?.[2] || '';

                const validLang = highlighter
                    .getLoadedLanguages()
                    .includes(language as any)
                    ? language
                    : 'text';

                // Parse line numbers to highlight
                const linesToHighlight = new Set<number>();
                if (highlightLines) {
                    highlightLines.split(',').forEach(part => {
                        const rangeMatch = part.match(/^(\d+)-(\d+)$/);
                        if (rangeMatch) {
                            // Range: "3-9"
                            const start = parseInt(rangeMatch[1], 10);
                            const end = parseInt(rangeMatch[2], 10);
                            for (let i = start; i <= end; i += 1) {
                                linesToHighlight.add(i);
                            }
                        } else {
                            // Single line: "5"
                            const lineNum = parseInt(part, 10);
                            if (!Number.isNaN(lineNum)) {
                                linesToHighlight.add(lineNum);
                            }
                        }
                    });
                }

                // Split text into lines to get accurate line lengths
                const lines = text.split('\n');

                const html = highlighter.codeToHtml(text, {
                    lang: validLang,
                    themes: {
                        light: 'light-plus',
                        dark: 'dark-plus',
                    },
                    defaultColor: false,
                    decorations:
                        linesToHighlight.size > 0
                            ? Array.from(linesToHighlight).map(line => {
                                  const lineIndex = line - 1;
                                  const lineLength =
                                      lines[lineIndex]?.length || 0;
                                  return {
                                      start: { line: lineIndex, character: 0 },
                                      end: {
                                          line: lineIndex,
                                          character: lineLength,
                                      },
                                      properties: { class: 'highlighted-line' },
                                  };
                              })
                            : undefined,
                });

                return `<div class="code-block" data-language="${language}">${html}</div>`;
            },
            heading({ tokens, depth }) {
                const text = this.parser.parseInline(tokens);
                const id = text
                    .toLowerCase()
                    .replace(/<[^>]*>/g, '')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/`/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                return `<h${depth} id="${id}">${text}</h${depth}>\n`;
            },
        },
    });

    const html = await marked.parse(content);

    // Helper to find closest available size
    const getOptimizedSize = (width: number) => {
        const sizes = [
            10, 16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200,
            1920, 2048, 3840,
        ];
        // Cap at 828 since max content width is 768px
        const cappedWidth = Math.min(width, 1920);

        // Find the smallest size that's >= cappedWidth (prefer next larger for quality)
        const largerSize = sizes.find(size => size >= cappedWidth);
        if (largerSize) return largerSize;

        // If no larger size found, return the largest available
        return sizes[sizes.length - 1];
    };

    // Helper to parse width and determine appropriate size
    const parseWidth = (widthStr: string | undefined): number => {
        if (!widthStr) return 640; // default

        // Check for percentage - calculate based on max content width (678px)
        if (widthStr.includes('%')) {
            const percentMatch = widthStr.match(/(\d+)%/);
            if (percentMatch) {
                const percent = parseInt(percentMatch[1], 10);
                return Math.round((percent / 100) * 678); // 678px is max content width
            }
        }

        // Extract numeric value
        const numMatch = widthStr.match(/(\d+)/);
        return numMatch ? parseInt(numMatch[1], 10) : 640;
    };

    // Post-process HTML to optimize img tags
    let processedHtml = html;

    // In development mode, skip optimization to avoid needing to run build for every image change
    const isDev = process.env.NODE_ENV === 'development';

    // Define responsive breakpoints (matching your hero image preload configuration)
    const breakpoints = {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        wide: 1440,
    };

    // Optimize <img> tags with /optimized-images/ src (handles both <img> and <img />)
    processedHtml = processedHtml.replace(
        /<img([^>]*?)src="(\/optimized-images\/[^"]+)"([^>]*?)(\/?)>/g,
        (match, before, src, after, selfClosing) => {
            // In development, return original image with basePath
            if (isDev) {
                const finalSrc = basePath ? `${basePath}${src}` : src;
                return `<img${before}src="${finalSrc}"${after}${selfClosing}>`;
            }

            // Check if already optimized
            if (src.includes('nextImageExportOptimizer')) {
                return match;
            }

            // Extract width from attributes to select appropriate size
            const allAttrs = before + after;
            const widthMatch = allAttrs.match(/width="?([^"\s]+)"?/);
            const widthStr = widthMatch?.[1];
            const requestedWidth = parseWidth(widthStr);
            const optSize = getOptimizedSize(requestedWidth);

            // Extract path and filename
            const parts = src.replace('/optimized-images/', '').split('/');
            const filename = parts.pop()?.replace(/\.[^.]+$/, '');
            const subPath = parts.length > 0 ? `${parts.join('/')}/` : '';

            // Helper to generate optimized path
            const getOptimizedPath = (size: number) => {
                const optimizedSrc = `/optimized-images/${subPath}nextImageExportOptimizer/${filename}-opt-${size}.WEBP`;
                return basePath ? `${basePath}${optimizedSrc}` : optimizedSrc;
            };

            // Generate srcset based on width type
            let srcsetAttr = '';
            let sizesAttr = '';

            if (widthStr?.includes('%')) {
                // Responsive image: use width descriptors with 1x and 2x for each breakpoint
                const percent = parseInt(
                    widthStr.match(/(\d+)/)?.[1] || '100',
                    10
                );

                // Calculate display widths at each breakpoint
                const displayWidths = [
                    Math.round((breakpoints.mobile * percent) / 100),
                    Math.round((breakpoints.tablet * percent) / 100),
                    Math.round((breakpoints.desktop * percent) / 100),
                    Math.round((breakpoints.wide * percent) / 100),
                ];

                // Generate 1x and 2x versions for each display width
                const srcsetParts: string[] = [];

                displayWidths.forEach(displayWidth => {
                    // 1x version (standard density)
                    const size1x = getOptimizedSize(displayWidth);
                    srcsetParts.push(
                        `${getOptimizedPath(size1x)} ${displayWidth}w`
                    );

                    // 2x version (retina displays)
                    const displayWidth2x = displayWidth * 2;
                    const size2x = getOptimizedSize(displayWidth2x);
                    srcsetParts.push(
                        `${getOptimizedPath(size2x)} ${displayWidth2x}w`
                    );
                });

                srcsetAttr = ` srcset="${srcsetParts.join(', ')}"`;
                sizesAttr = ` sizes="(max-width: ${breakpoints.mobile}px) ${percent}vw, (max-width: ${breakpoints.tablet}px) ${percent}vw, (max-width: ${breakpoints.desktop}px) ${percent}vw, ${displayWidths[3]}px"`;
            } else {
                // Fixed width: use pixel density descriptors (1x, 2x)
                const size1x = optSize;
                const size2x = getOptimizedSize(requestedWidth * 2);

                const src1x = getOptimizedPath(size1x);
                const src2x = getOptimizedPath(size2x);

                srcsetAttr = ` srcset="${src1x} 1x, ${src2x} 2x"`;
            }

            // Use the primary optimized size as fallback src
            const finalSrc = getOptimizedPath(optSize);

            // Add lazy loading if not present
            const hasLoading = /loading=/.test(before + after);
            const loadingAttr = hasLoading ? '' : ' loading="lazy"';

            return `<img${before}src="${finalSrc}"${srcsetAttr}${sizesAttr}${after}${loadingAttr}${selfClosing}>`;
        }
    );

    // Add basePath to remaining img src attributes
    if (basePath) {
        processedHtml = processedHtml.replace(
            /<img([^>]*?)src="(\/[^"]+)"/g,
            (match, attrs, src) => {
                // Skip if already has basePath or is optimized-images (already handled above)
                if (
                    src.startsWith(basePath) ||
                    src.includes('/optimized-images/')
                ) {
                    return match;
                }
                return `<img${attrs}src="${basePath}${src}"`;
            }
        );
    }

    return processedHtml;
}
