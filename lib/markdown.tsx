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
                const language = lang || 'text';
                const validLang = highlighter
                    .getLoadedLanguages()
                    .includes(language as any)
                    ? language
                    : 'text';

                const html = highlighter.codeToHtml(text, {
                    lang: validLang,
                    themes: {
                        light: 'light-plus',
                        dark: 'dark-plus',
                    },
                    defaultColor: false,
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
