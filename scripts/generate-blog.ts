#!/usr/bin/env tsx
/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';

const slug = process.argv[2];

if (!slug) {
    console.error('Error: Slug is required!');
    console.error('Usage: yarn generate:blog <slug>');
    console.error('Example: yarn generate:blog ai-friendly-portfolio-webapp');
    process.exit(1);
}

const templatePath = path.join(process.cwd(), 'templates', 'blog.mdx');
const contentDir = path.join(process.cwd(), 'content', 'blog');
const outputPath = path.join(contentDir, `${slug}.mdx`);

if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found at ${templatePath}`);
    process.exit(1);
}

if (fs.existsSync(outputPath)) {
    console.error(`Error: Blog post already exists at ${outputPath}`);
    process.exit(1);
}

if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

const template = fs.readFileSync(templatePath, 'utf-8');
const today = new Date().toISOString().split('T')[0];
const content = template.replace('2026-01-01', today);

fs.writeFileSync(outputPath, content);

console.log(`✅ Blog post created successfully at: content/blog/${slug}.mdx`);
console.log(`📝 Edit the file to add your blog content`);
