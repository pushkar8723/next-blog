import { Marked } from 'marked';
import { createHighlighter, type Highlighter } from 'shiki';

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

    // Custom renderer for code blocks with Shiki
    marked.use({
        renderer: {
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
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                return `<h${depth} id="${id}">${text}</h${depth}>\n`;
            },
        },
    });

    const html = await marked.parse(content);
    return html;
}
