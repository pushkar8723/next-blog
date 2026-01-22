# My Portfolio + Blog

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

🚀 [Live Demo](https://pushkar8723.github.io/next-blog/)

I migrated my blog from Gatsby to Next.js and, in the process, created a template that I think is
far more easily customizable and hackable than my previous blog.

## Quick Start

### Prerequisites

- Node.js 20+
- Yarn 4.12+ (Corepack enabled)

### Local Development

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev
```

Open http://localhost:3000

## Creating Content

### Blog Post Example

Create a file in `/content/blog/my-post.mdx`:

```mdx
---
title: 'My First Post'
description: 'An introduction to my blog'
date: '2026-01-22'
keywords: 'nextjs, blog, portfolio'
---

# My First Post

Your content here...
```

## Deployment

The easiest way to deploy this project is through GitHub Pages or Vercel. However, if you need to deploy
on any other platform, the project is configured such that the default configuration should work for
most platforms. If it doesn't work, you will need to configure the following commands:

### Configure Environment Variables

Make sure you have configured the environment variables described in the Features section below.

### Install Dependencies

```bash
yarn install
```

### Build App

```bash
yarn build
```

### Output

The built static files will be present in the `/out` directory. Simply host the contents of this directory.

## The Story

Earlier I used Gatsby to generate my [blog](https://github.com/pushkar8723/blog) and it was great at its job.
The static site generated was performant, the layout was clean and with Gatsby's rich plugin ecosystem it was
easy to add features as per my requirements.

However, I found it very hard to templatize or explain to a non-JavaScript developer how it works. Even for many
JavaScript developers, the learning curve was high. You need to be comfortable with GraphQL to make any
modifications, or you'd be stuck with whatever I provide. I even found it hard to change certain things
like customizing the OG image or Twitter card image for my posts. I was at the mercy of what the plugin author
provided. Sure, I could read the plugin code, make modifications, and use it. But that's just too much work!
And I never took the time to truly understand GatsbyImage. I used MDX for generating blog pages, which meant
that I also needed to make GatsbyImage work with MDX—something I never got to because by the time I was done
creating pages, sub-pages, blogs, and configuring plugins for code highlighting, OG images, and RSS feed
generation, I was too overwhelmed to configure one more thing.

Hence, for quite some time, it was on my mind to move to Next.js. Over the years of using it in my professional
work, I found the file-based routing quite easy to navigate and explain to anyone. It is very lean and hackable,
able to generate not just HTML, CSS, and JavaScript, but anything from XML to images. The only issue is the lack of a
rich plugin ecosystem, but that also meant I could do things the way I want them this time.

So one fine day, I decided to see how good AI has become. I logged into [v0](https://v0.app/), gave it
my requirements, and was surprised that it was able to create (with some prompting and correcting) a Next.js
site that somewhat did what I wanted.

## Hacking a Blogging Web App

The website that v0 created had a better layout than my previous blog but lacked readability. The theming
was a bit off. It added too many unused dependencies (which get tree-shaken in the prod build, but it's still not good
from a code maintenance perspective) because I didn't intend to depend on v0 or any other AI app for maintenance.
Many would disagree with me on this. However, I still feel that AI is good for generating code but bad for
maintenance, simply because it can't see or experience the app as a human does.

## The Good and the Bad

Before listing the features, I want to quickly summarize what v0 got right and what it got wrong:

The good parts:

- **HomePage**: The current homepage might look generic, but it was leaps and bounds ahead of what I created
  using the Gatsby Start Blog template, with 3 recent posts and the top 3 projects highlighted on the home page.
- **MDX Blog Page Generation**: I just love the blog page it generated. As per my requirement, it used MDX
  and gray-matter to generate the page's metadata and content. It even generated a table of contents visible
  only on large screens with smooth scrolling and highlighting.
- **OG Image and RSS Feed**: It also created the [OG route](/app/og/[slug]/route.tsx) to generate the OG
  image and [RSS route](/app/rss.xml/route.ts) to generate the RSS XML.
- **Site Config**: Using [site-config.tsx](/lib/site-config.tsx) for abstracting out site's meta data was
  great and helps in templatizing the app.

The bad parts:

- **Theming**: While I understand that it might be an issue with the v0 template and not the AI, the default
  color scheme is way too reliant on just black and white (at least in dark mode). I checked with 2 people
  on this, and they had the same opinion.
- **Layout and Responsiveness**: The spacing was way off. In some places, elements were way too close to each
  other, making it hard to distinguish between sections, or the links didn't stand out enough to look clickable.
  The navbar was not responsive on smaller screens.
- **Project Section**: It did create a project page, but it used a static JS object to create a list of projects,
  which wasn't great since I wanted a dedicated page for each project where I could describe it. It should
  have stuck with MDX for this and other pages like About Me as well.
- **Hero Section**: The generated hero section was good enough to explain the website and provide links to
  my social profiles but was too plain for a portfolio.
- **Deprecated Dependencies**: This again could be a v0 template issue, but some of the dependencies included
  by v0 were already deprecated. For example, the components it used for social media icons were already deprecated.
- **Unnecessary Files**: It also had two global CSS files (one wasn't used) and a few files in the root folder
  that weren't used anywhere in the project.
- **CI/CD**: There were no lint or formatting checks, no pre-commit checks, no build checks, and the whole setup
  was tailored for Vercel (which might be intentional, I know, but it's not ideal since I wanted a generic app that
  could be hosted anywhere easily).

## Features:

Although I've already discussed most of the features above, it's good to list them in one place:

- **Site Config**: All the metadata about the app is stored in [site config file](/lib/site-config.tsx).
- **Homepage**: Homepage is automatically generated from site config, blogs and projects.
- **Blog**: Blog list page and individual blog pages are automatically generated from [/content/blog](/content/blog/)
- **Projects**: Projects list page and individual Project pages are automatically generated from [/content/projects](/content/projects/).
- **Pages**: All other MDX files in [/content/](/content/) generate individual pages.
- **OG Image**: Open Graph (OG) images are automatically generated by the [/app/og/[slug]](/app/og/[slug])
  route for all pages.
- **RSS Feed**: RSS feed is generated for each blog post by [/app/rss.xml](/app/rss.xml/) route.
- **Sitemap**: Similar to RSS Feed, I also created [/app/sitemap.xml](/app/sitemap.xml/) to generate sitemap
  for SEO. It uses file modification time for each MDX file for accurate `lastmod` time in sitemap.
- **Code Highlighting**: I personally like the vscode theme and so I have configured code highlighting to
  have the default vscode theme. This is a theme that I feel most developers would be comfortable with.
- **Work without JavaScript**: The app generated by v0 relied on JavaScript for light/dark theme. I refactored
  it be a purely CSS theme. Now the site will work without JavaScript (for 99% of use-cases).
- **Image Optimizations**: Next.js relies on an edge server for image optimizations. For statically exported
  apps, image optimization is disabled. I used `next-image-export-optimizer` to generate optimized images
  of different dimensions. Any image placed in [/public/optimized-images/](/public/optimized-images/) folder
  will be picked up during build and optimized images of different sizes will be generated. Also the image src
  in MDX files will be updated with the optimized image. In development this optimization is not done. This is
  so that while writing a blog, the user doesn't need to worry about image optimization. All that is needed from the user
  is to place images in the `optimized-images` folder and reference them properly in the `src` attribute. The rest is taken
  care of by the build process.
- **Hot Reload for MDX**: Since MDX file changes are not monitored by Next.js, [mdx-reload](/app/mdx-reload.tsx)
  component is used to automatically refresh the route on MDX file change. This is only present in development
  and is not used in production build.
- **Maintenance Scripts**: I added scripts like `analyze` and `cleanup` for easy debugging / cleanup.
- **GitHub Page Generation**: Since a major use-case of such apps is to be hosted on GitHub Pages, I created
  a [workflow](/.github/workflows/deploy.yml) to automatically check lint, format, build and deploy the app
  whenever a commit is pushed to the `main` branch.
- **Environment Variables**: The following environment variables are used to customize production builds according to the
  environment:
    - **NEXT_PUBLIC_SITE_URL**: URL of the blog.
    - **NEXT_PUBLIC_CANONICAL_URL**: In case of multi-environment deployment, this should be the primary
      URL of the blog. For example, I deploy my blog on my GitHub Pages as well as my domain
      [abstracted.in](https://www.abstracted.in), so the value of this variable is https://www.abstracted.in.
      This is used to add a `canonical` meta tag when the site URL is different from blog's main URL.
    - **BASE_PATH**: Base path of the app. This is required if the app is deployed on a sub-path of a domain.
      For example, with my GitHub Pages, it's deployed on
      [https://pushkar8723.github.io/next-blog/](https://pushkar8723.github.io/next-blog/), so `/next-blog`
      is the sub-path. This ensures that images are loaded properly. If not present, it defaults to `/`.
- **404 Page**: A custom 404 page is also generated with links to Home page and Blog Page.

## Why I Think This Is Better

It should be clear from the feature list that while creating this app, I comprehensively covered
the functionality that is expected out of a blog / portfolio. However there are certain nuances that I
would like to point out to explain why I feel this setup is better than my earlier Gatsby Blog.

- This is, I feel, a very beginner-friendly template. Anyone with basic knowledge of React can easily hack
  around with this template to customize the look and feel of the app. AI can also help with customization.
  No fiddling around with GraphQL queries or configuring plugins across different Gatsby files.
- The performance aspect of the app is taken care of. The user doesn't need to worry about
    - Build optimization (Next.js takes care of it).
    - SEO tags are generated using MDX metadata (front-matter section of MDX).
    - Image optimization comes out of the box (just place the image in the `optimized-images` folder).
    - OG images for each page are generated using plain HTML and CSS, and anyone with basic HTML/CSS
      knowledge can easily customize them.
- Can be easily deployed on multiple environments.
- Using MDX across pages for content ensures that the styling and look-and-feel of the app remain consistent
  across all pages.
- The app is responsive for different screen sizes.
- I also made sure that the app is accessible.

Thus, even a beginner (or someone who is not an expert in web development) can forget about everything
and just start adding MDX files to the `/content` directory to create a performant, SEO-friendly, and
accessible portfolio + blog website that can also be easily customized using AI.

## FAQ

<details>
<summary>Q: How do I customize site metadata (name, social links)?</summary>
A: Edit <code>/lib/site-config.tsx</code> with your information.
</details>
<br/>
<details>
<summary>Q: Where do I put images for blog posts?</summary>
A: Place them in <code>/public/optimized-images/</code> and reference with relative paths in MDX.
</details>
<br/>
<details>
<summary>Q: How do I add syntax highlighting for a new language?</summary>
A: Add the language to the <code>langs</code> array in <code>/lib/markdown.tsx</code>.
</details>
<br/>
<details>
<summary>Q: Can I deploy to platforms other than GitHub Pages?</summary>
A: Yes! Works on Vercel, Netlify, or any static host. Just run <code>yarn build</code> and upload the <code>/out</code> directory.
</details>
<br/>
<details>
<summary>Q: Can I use npm instead of yarn?</summary>
A: Yes, but you'll need to delete <code>yarn.lock</code> first.
</details>
<br/>
<details>
<summary>Q: How do I change the color scheme?</summary>
A: Edit CSS variables in <code>/app/globals.css</code>
</details>
