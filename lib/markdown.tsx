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
                // Check if image is in optimized-images folder and replace with optimized WebP
                let finalSrc = href;
                if (
                    href.startsWith('/optimized-images/') &&
                    !href.includes('nextImageExportOptimizer')
                ) {
                    // Extract path and filename
                    // e.g., /optimized-images/about-me/profile-pic.jpg
                    // -> path: about-me, filename: profile-pic
                    const parts = href
                        .replace('/optimized-images/', '')
                        .split('/');
                    const filename = parts.pop()?.replace(/\.[^.]+$/, '');
                    const subPath =
                        parts.length > 0 ? `${parts.join('/')}/` : '';

                    // Use 640px optimized WebP version (good balance for most images)
                    finalSrc = `/optimized-images/${subPath}nextImageExportOptimizer/${filename}-opt-640.WEBP`;
                }

                // Prefix local images with basePath
                const src =
                    finalSrc.startsWith('/') && basePath
                        ? `${basePath}${finalSrc}`
                        : finalSrc;

                // Parse title for dimensions, alignment, and loading (format: "width=350 height=350 center eager" or just "title text")
                let attributes = '';
                let styles = '';
                let hasProps = false;

                if (title) {
                    const widthMatch = title.match(/width=(\d+)/);
                    const heightMatch = title.match(/height=(\d+)/);
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

    // Post-process HTML to add basePath to img src attributes only
    const processedHtml = basePath
        ? html.replace(
              /<img([^>]*?)src="(\/[^"]+)"/g,
              `<img$1src="${basePath}$2"`
          )
        : html;

    return processedHtml;
}
