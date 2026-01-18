// Read BASE_PATH at module load time to capture build-time environment
const BASE_PATH = process.env.BASE_PATH || '';

/**
 * Get the configured base path for the application
 * Used for GitHub Pages project site deployment
 *
 * The BASE_PATH is captured at module load time (build time for static export)
 * so it will have the correct value from the build environment
 */
export function getBasePath(): string {
    return BASE_PATH;
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
