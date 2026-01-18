/**
 * Get the configured base path for the application
 * Used for GitHub Pages project site deployment
 */
export function getBasePath(): string {
    return process.env.BASE_PATH || '';
}

/**
 * Prefix a path with the base path
 * @param path - The path to prefix (should start with /)
 * @returns The path with base path prefix
 */
export function withBasePath(path: string): string {
    const basePath = getBasePath();
    if (!basePath || !path.startsWith('/')) {
        return path;
    }
    return `${basePath}${path}`;
}
