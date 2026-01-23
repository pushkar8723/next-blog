# Next.js Portfolio + Blog

## Project Overview

**Type**: Static site generator for portfolio + blog
**Framework**: Next.js 16 with static export
**Content System**: MDX files with frontmatter metadata
**Build Output**: Static HTML/CSS/JS in `/out` directory

## Architecture

### Content-to-Route Mapping

All pages are generated from MDX files in [/content/](/content/) directory:

| Content Type   | Source Directory          | Route Pattern     | List Page                                        | Sort Order               |
| -------------- | ------------------------- | ----------------- | ------------------------------------------------ | ------------------------ |
| **Blog Posts** | `/content/blog/*.mdx`     | `/blog/:slug`     | [/app/blog/page.tsx](/app/blog/page.tsx)         | Date (newest first)      |
| **Projects**   | `/content/projects/*.mdx` | `/projects/:slug` | [/app/projects/page.tsx](/app/projects/page.tsx) | Priority (highest first) |
| **Pages**      | `/content/*.mdx`          | `/:slug`          | None                                             | N/A                      |

**Slug derivation**: Filename without extension (e.g., `my-post.mdx` → `/blog/my-post`)

### Page Structure

**Homepage** ([/app/page.tsx](/app/page.tsx)):

- Hero section from [/lib/site-config.tsx](/lib/site-config.tsx)
- 3 most recent blog posts
- Top 3 projects (by priority)

**Layout** ([/app/layout.tsx](/app/layout.tsx)):

- Applied to all pages
- Contains Header and Footer components
- Manages HTML structure and metadata

### Key Components

| Component    | File                                             | Purpose                 | Configuration                                |
| ------------ | ------------------------------------------------ | ----------------------- | -------------------------------------------- |
| **Header**   | [/components/header.tsx](/components/header.tsx) | Navigation links        | `navLinks` array (add new pages here)        |
| **Footer**   | [/components/footer.tsx](/components/footer.tsx) | Social profile links    | Sourced from site config                     |
| **Bio**      | [/components/bio.tsx](/components/bio.tsx)       | Avatar + title/subtitle | Used on homepage and blog pages              |
| **Markdown** | [/lib/markdown.tsx](/lib/markdown.tsx)           | MDX rendering config    | Code highlighter theme, HTML post-processing |

### Important File Locations

- **Site metadata**: [/lib/site-config.tsx](/lib/site-config.tsx) - name, description, social links, avatar
- **Content templates**: [/templates/](/templates/) - blog.mdx, project.mdx, page.mdx
- **Generator scripts**: [/scripts/](/scripts/) - TypeScript files for creating content
- **Optimized images**: [/public/optimized-images/](/public/optimized-images/) - Source for image optimization

## Technical Features & Implementation

### Site Configuration

- **File**: [/lib/site-config.tsx](/lib/site-config.tsx)
- **Purpose**: Central location for all site metadata (name, description, social links, avatar)
- **Usage**: Imported by layout, header, footer, and OG image generation

### Content Generation System

- **MDX Processing**: All content is authored in MDX format with frontmatter metadata
- **Static Generation**: Pages are generated at build time using Next.js static export
- **Content Types**:
    1. **Blogs**: MDX files in [/content/blog/](/content/blog/) → routes at `/blog/:slug`
    2. **Projects**: MDX files in [/content/projects/](/content/projects/) → routes at `/projects/:slug` (sorted by `priority` field)
    3. **Pages**: MDX files in [/content/](/content/) → routes at `/:slug`

### Automated Page Generation

- **Blog List**: [/app/blog/page.tsx](/app/blog/page.tsx) - Auto-lists all blogs sorted by date (newest first)
- **Project List**: [/app/projects/page.tsx](/app/projects/page.tsx) - Auto-lists all projects sorted by priority (highest first)
- **Homepage**: [/app/page.tsx](/app/page.tsx) - Auto-populates with 3 most recent blogs + top 3 projects
- **Dynamic Routes**: `[slug]` directories handle individual content pages

### SEO & Meta

- **OG Images**: [/app/og/[slug]/route.tsx](/app/og/[slug]/route.tsx) - Generates PNG images from HTML/CSS for each page
- **RSS Feed**: [/app/rss.xml/route.ts](/app/rss.xml/route.ts) - Generates XML feed for blog posts
- **Sitemap**: [/app/sitemap.xml/route.ts](/app/sitemap.xml/route.ts) - Uses file modification times for accurate `lastmod`
- **Canonical URLs**: Configurable via `NEXT_PUBLIC_CANONICAL_URL` environment variable

### Image Optimization

- **Package**: `next-image-export-optimizer`
- **Source Directory**: [/public/optimized-images/](/public/optimized-images/)
- **Build Behavior**:
    - Development: No optimization (for fast feedback)
    - Production: Generates multiple sizes, updates MDX src attributes automatically
- **User Action**: Place images in `optimized-images` folder, reference in MDX, optimization is automatic

### Code Highlighting

- **Engine**: Shiki with VS Code default theme
- **Configuration**: [/lib/markdown.tsx](/lib/markdown.tsx)
- **Customization**: Modify `langs` array and `theme` setting in markdown.tsx

### Theming

- **Implementation**: Pure CSS (no JavaScript required)
- **Theme File**: [/app/globals.css](/app/globals.css)
- **Works Without JS**: Light/dark mode uses CSS variables and media queries

### Development Features

- **MDX Hot Reload**: [/app/mdx-reload.tsx](/app/mdx-reload.tsx) - Watches MDX files, triggers page refresh (dev only)
- **API Route**: [/app/api/mdx-watch/route.ts](/app/api/mdx-watch/route.ts) - Polling endpoint for MDX changes

### Comments

- **System**: Giscus (GitHub Discussions-backed)
- **Component**: [/components/giscus.tsx](/components/giscus.tsx)
- **Configuration**: [/lib/site-config.tsx](/lib/site-config.tsx) → `comments.giscus` object
- **Enable/Disable**: Set `enabled: true/false` in `comments.giscus`
- **Setup Requirements**: GitHub repository with Discussions enabled
- **Config Fields**: repo, repoId, category, categoryId, mapping, theme, lang, etc.
- **Behavior**: Returns null if disabled or not configured

### Blog Subscription

- **System**: Substack embed (newsletter subscription)
- **Component**: [/components/substack-subscribe.tsx](/components/substack-subscribe.tsx)
- **Configuration**: [/lib/site-config.tsx](/lib/site-config.tsx) → `subscribe.substack` (username)
- **Enable/Disable**: Set or remove `subscribe.substack` value
- **Location**: Renders at bottom of blog posts (production only)
- **Behavior**: Returns null if substack username not configured
- **Future Ready**: `subscribe` object can hold multiple subscription methods

### Content Generation Scripts

- **Blog**: `yarn generate:blog <slug>` → creates [/content/blog/{slug}.mdx](/content/blog/)
- **Project**: `yarn generate:project <slug>` → creates [/content/projects/{slug}.mdx](/content/projects/)
- **Page**: `yarn generate:page <slug>` → creates [/content/{slug}.mdx](/content/)
- **Template Files**: [/templates/](/templates/) directory contains MDX templates
- **Script Location**: [/scripts/](/scripts/) directory (TypeScript files executed via tsx)
- **Error Handling**: Scripts validate slug presence, check file existence, show descriptive errors

### Build Configuration

- **Static Export**: Next.js configured for static HTML export
- **Output Directory**: `/out`
- **Image Optimization**: Runs as post-build step via `optimize:images` script
- **API Route Handling**: API routes temporarily moved during build, restored after

### Environment Variables

- **NEXT_PUBLIC_SITE_URL**: Full URL of deployed site (used for absolute URLs in RSS/sitemap)
- **NEXT_PUBLIC_CANONICAL_URL**: Primary domain if multi-environment (adds canonical meta tag)
- **BASE_PATH**: Sub-path for deployment (e.g., `/next-blog` for GitHub Pages sub-path)

### CI/CD

- **Platform**: GitHub Actions
- **Workflow File**: [/.github/workflows/deploy.yml](/.github/workflows/deploy.yml)
- **Triggers**: Push to `main` branch
- **Steps**: Lint → Format Check → Build → Deploy

## Local Development Instructions

### Prerequisites

- Node.js 20+ (required for Next.js 16)
- Yarn 4.12+ (corepack must be enabled: `corepack enable`)

### Setup Steps

```bash
yarn install  # Install all dependencies
yarn dev      # Start dev server on http://localhost:3000
```

### Creating Content

**Option 1: Use Generator Scripts** (Recommended)

```bash
yarn generate:blog <slug>      # Creates /content/blog/<slug>.mdx
yarn generate:project <slug>   # Creates /content/projects/<slug>.mdx
yarn generate:page <slug>      # Creates /content/<slug>.mdx
```

**Option 2: Manual Creation**

1. Copy template from [/templates/](/templates/) directory
2. Create file in appropriate [/content/](/content/) subdirectory
3. Fill in frontmatter fields (title, description, date, etc.)
4. Author content in MDX format

### Key Development Commands

- `yarn dev` - Start dev server (includes MDX hot reload)
- `yarn lint` - Run ESLint checks
- `yarn format` - Auto-format all files with Prettier
- `yarn format:check` - Check formatting without modifying files
- `yarn clean` - Remove build artifacts and optimized images

### Adding Pages to Navigation

After creating a page, update [/components/header.tsx](/components/header.tsx):

1. Locate `navLinks` array
2. Add new entry with `href` and `label`

## Deployment Instructions

### Build Process

```bash
yarn install  # Install dependencies
yarn build    # Runs: prepare → next build → optimize images → restore
```

**Output**: Static files in `/out` directory ready for hosting

### Environment Configuration

Set these environment variables based on deployment environment:

| Variable                    | Purpose                    | Example               | Required    |
| --------------------------- | -------------------------- | --------------------- | ----------- |
| `NEXT_PUBLIC_SITE_URL`      | Full site URL              | `https://example.com` | Yes         |
| `NEXT_PUBLIC_CANONICAL_URL` | Primary domain (multi-env) | `https://example.com` | Optional    |
| `BASE_PATH`                 | Sub-path deployment        | `/next-blog`          | If sub-path |

### Platform-Specific Notes

**GitHub Pages (with sub-path)**:

- Set `BASE_PATH=/repo-name`
- Configure custom domain or use `username.github.io/repo-name`

**Vercel/Netlify**:

- Auto-detects Next.js, no special config needed
- Set environment variables in platform UI

**Generic Static Host**:

- Upload contents of `/out` directory
- Configure environment variables before build

### Deployment Verification

1. Check OG images: Visit `/og/<slug>` routes
2. Verify RSS feed: Visit `/rss.xml`
3. Check sitemap: Visit `/sitemap.xml`
4. Test responsive design and theme switching

---

## LLM Assistance Guide

This section helps LLMs assist users effectively with common portfolio tasks.

### Common User Requests & How to Handle Them

| User Request                | Action Required           | Commands/Files                                                         |
| --------------------------- | ------------------------- | ---------------------------------------------------------------------- |
| "Add my profile info"       | Update site config        | Edit [/lib/site-config.tsx](/lib/site-config.tsx)                      |
| "Write a blog post about X" | Create blog with content  | `yarn generate:blog <slug>` → Edit MDX                                 |
| "Add my project Y"          | Create project page       | `yarn generate:project <slug>` → Edit MDX                              |
| "Add About page"            | Create page + add to nav  | `yarn generate:page about` → Update header.tsx                         |
| "Change colors"             | Update CSS variables      | Edit [/app/globals.css](/app/globals.css)                              |
| "Add image to post"         | Place in optimized-images | Copy to `/public/optimized-images/` → Reference in MDX                 |
| "Enable comments"           | Configure Giscus          | Edit [/lib/site-config.tsx](/lib/site-config.tsx) `comments.giscus`    |
| "Add newsletter signup"     | Configure Substack        | Edit [/lib/site-config.tsx](/lib/site-config.tsx) `subscribe.substack` |
| "Disable comments"          | Turn off Giscus           | Set `comments.giscus.enabled: false` in site-config                    |
| "See my changes"            | Start dev server          | `yarn dev`                                                             |
| "Deploy my site"            | Build and deploy          | `yarn build` → Host `/out` directory                                   |

### Initial Setup Checklist

When user first sets up their portfolio, guide them through:

1. **Update Personal Info**: Edit [/lib/site-config.tsx](/lib/site-config.tsx)
    - name, title, subtitle
    - email, social links (GitHub, LinkedIn, Twitter)
    - avatar path

2. **Configure Optional Features** (if desired):
    - **Comments**: Update `comments.giscus` section with GitHub repo details
        - Get config from https://giscus.app after enabling Discussions on your repo
        - Set `enabled: true` to activate
    - **Newsletter**: Set `subscribe.substack` to your Substack username
        - Leave empty or remove if not using Substack

3. **Create Initial Content**:
    - About page: `yarn generate:page about-me`
    - Work experience: `yarn generate:page work-ex`
    - First blog post: `yarn generate:blog hello-world`
    - First project: `yarn generate:project my-first-project`

4. **Update Navigation**: Add pages to [/components/header.tsx](/components/header.tsx)
    - Find `navLinks` array
    - Add entries: `{ href: '/about-me', label: 'About' }`

5. **Test Locally**: `yarn dev` → Open http://localhost:3000

### Content Creation Workflow

**For blog posts:**

1. Generate: `yarn generate:blog descriptive-slug-name`
2. File created at: `/content/blog/descriptive-slug-name.mdx`
3. Update frontmatter: title, description, date, keywords
4. Write content in MDX (supports markdown + React components)
5. Add images to: `/public/optimized-images/blogs/descriptive-slug-name/`
6. Reference images: `![alt text](../../public/optimized-images/blogs/descriptive-slug-name/image.png)`
7. Preview: `yarn dev` → Visit `/blog/descriptive-slug-name`

**For projects:**

1. Generate: `yarn generate:project project-name`
2. Update frontmatter: title, description, github, priority (0-10), tags
3. Higher priority = appears first on projects page
4. Add project screenshots to: `/public/optimized-images/projects/project-name/`

**For pages:**

1. Generate: `yarn generate:page page-name`
2. Update frontmatter: title, description
3. Ask user if they want to add to navigation
4. If yes, update [/components/header.tsx](/components/header.tsx)

### Troubleshooting Guide

| Problem                   | Likely Cause                          | Solution                                                       |
| ------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| "Command not found: yarn" | Corepack not enabled                  | Run `corepack enable`                                          |
| "Images not showing"      | Wrong path or not in optimized-images | Move to `/public/optimized-images/`, use correct relative path |
| "Page not appearing"      | Not added to nav or wrong slug        | Check filename matches route, verify slug in URL               |
| "Build fails"             | Missing dependencies or syntax error  | Run `yarn install`, check error message for file               |
| "Changes not showing"     | Dev server not running                | Run `yarn dev`, wait for compilation                           |
| "Project not at top"      | Priority too low                      | Increase `priority` number in project frontmatter              |

### File Editing Best Practices

**When editing site config:**

- Preserve TypeScript syntax
- Keep all export statements
- Validate social links are complete URLs

**When editing MDX files:**

- Keep frontmatter between `---` delimiters
- Use valid YAML syntax (quotes for strings with special chars)
- Date format: `YYYY-MM-DD`
- Tags/keywords: comma-separated strings

**When updating navigation:**

- Maintain array syntax: `[{ href: '/path', label: 'Label' }]`
- href must match file slug
- label is displayed text

### Helpful Responses for Common Scenarios

**User says "I want to add X":**

1. Determine content type (blog/project/page)
2. Ask for necessary details (title, description, slug preference)
3. Generate file using appropriate script
4. Offer to write initial content or have them provide it
5. Remind about navigation update if it's a page

**User says "It's not working":**

1. Ask what they're trying to do and what they see
2. Check if dev server is running
3. Verify file was created in correct location
4. Check for syntax errors in frontmatter
5. Suggest specific terminal command to check logs

**User says "How do I deploy?":**

1. Confirm they've tested locally (`yarn dev`)
2. Explain they need to run `yarn build`
3. Ask where they want to host (GitHub Pages, Vercel, etc.)
4. Provide platform-specific instructions from Deployment section
5. Mention environment variables if needed

### Quick Command Reference

```bash
# Setup
yarn install              # Install dependencies
corepack enable          # Enable Yarn 4 (if needed)

# Development
yarn dev                 # Start dev server (http://localhost:3000)
yarn lint                # Check code quality
yarn format              # Auto-format code

# Content Generation
yarn generate:blog my-post      # Create blog post
yarn generate:project my-proj   # Create project
yarn generate:page my-page      # Create page

# Build & Deploy
yarn build               # Build static site to /out
yarn clean              # Remove build artifacts

# Debugging
yarn lint               # Check for code errors
yarn format:check       # Check formatting issues
```

### MDX Frontmatter Examples

**Blog Post:**

```yaml
---
title: 'How I Built This'
date: '2026-01-24'
description: 'A detailed look at building my portfolio'
keywords: 'nextjs, portfolio, mdx, tutorial'
---
```

**Project:**

```yaml
---
title: Awesome Project
description: A project that does amazing things
github: username/repo
priority: 8
tags: react, typescript, api
---
```

**Page:**

```yaml
---
title: About Me
description: Learn more about my background and experience
---
```

### When to Read Files

Before editing, always read the file first to:

- Understand current structure
- Preserve existing content
- Avoid syntax errors
- See user's preferences/style

**Files to read before editing:**

- [/lib/site-config.tsx](/lib/site-config.tsx) - Before updating personal info
- [/components/header.tsx](/components/header.tsx) - Before adding navigation links
- Any MDX file - Before updating content
- [/app/globals.css](/app/globals.css) - Before changing styles
