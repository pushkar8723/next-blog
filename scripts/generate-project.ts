#!/usr/bin/env tsx
/* eslint-disable no-console */

import * as fs from 'fs';
import * as path from 'path';

const slug = process.argv[2];

if (!slug) {
    console.error('Error: Slug is required!');
    console.error('Usage: yarn generate:project <slug>');
    console.error('Example: yarn generate:project my-awesome-project');
    process.exit(1);
}

const templatePath = path.join(process.cwd(), 'templates', 'project.mdx');
const contentDir = path.join(process.cwd(), 'content', 'projects');
const outputPath = path.join(contentDir, `${slug}.mdx`);

if (!fs.existsSync(templatePath)) {
    console.error(`Error: Template file not found at ${templatePath}`);
    process.exit(1);
}

if (fs.existsSync(outputPath)) {
    console.error(`Error: Project already exists at ${outputPath}`);
    process.exit(1);
}

if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
}

const template = fs.readFileSync(templatePath, 'utf-8');

fs.writeFileSync(outputPath, template);

console.log(`✅ Project created successfully at: content/projects/${slug}.mdx`);
console.log(`📝 Edit the file to add your project details`);
