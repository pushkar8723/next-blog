#!/usr/bin/env tsx
/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';

const slug = process.argv[2];

if (!slug) {
    console.error('Error: Slug is required!');
    console.error('Usage: yarn generate:page <slug>');
    console.error('Example: yarn generate:page about-me');
    process.exit(1);
}

const templatePath = path.join(process.cwd(), 'templates', 'page.mdx');
const contentDir = path.join(process.cwd(), 'content');
const outputPath = path.join(contentDir, `${slug}.mdx`);

if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found at ${templatePath}`);
    process.exit(1);
}

if (fs.existsSync(outputPath)) {
    console.error(`Error: Page already exists at ${outputPath}`);
    process.exit(1);
}

if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

const template = fs.readFileSync(templatePath, 'utf-8');

fs.writeFileSync(outputPath, template);

console.log(`✅ Page created successfully at: content/${slug}.mdx`);
console.log(`📝 Edit the file to add your page content`);
console.log(
    `💡 Consider adding this page to the navigation links in components/header.tsx`
);
