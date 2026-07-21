# Personal Static Blog

Dependency-free personal blog built with HTML, CSS, vanilla JavaScript, and a Node.js build script that uses only built-in modules.

## Project Overview

- Static site for GitHub Pages.
- Blog posts are written in Markdown in the `posts/` folder.
- Build script converts Markdown into static HTML pages.
- `data/posts.json`, `sitemap.xml`, `robots.txt`, and `rss.xml` are generated automatically.
- The homepage (`index.html`) contains the post listing and search box.

## Folder Structure

```text
.
|- .github/workflows/
|  |- deploy.yml
|- blog/
|  |- *.html (generated post pages)
|- css/
|  |- styles.css
|- data/
|  |- posts.json (generated)
|- js/
|  |- site.js
|- posts/
|  |- *.md
|- tools/
|  |- build.js
|- index.html
|- robots.txt (generated)
|- rss.xml (generated)
|- sitemap.xml (generated)
```

## Local Development

1. Install Node.js 20 or newer.
2. Run the build:

```bash
node tools/build.js
```

3. Open `index.html` in a browser.

Re-run the build whenever Markdown files in `posts/` are added, changed, or deleted.

## Deployment (GitHub Pages)

The workflow at `.github/workflows/deploy.yml`:

1. Runs on every push to `main`.
2. Executes `node tools/build.js`.
3. Uploads the repository as the Pages artifact.
4. Deploys to GitHub Pages.

Optional: set repository variable `SITE_URL` to your production base URL (for example, `https://yourdomain.com`) so generated RSS and sitemap URLs match your domain.

## Adding a New Blog Post

1. Create a Markdown file in `posts/`, such as `my-new-post.md`.
2. Add front matter at the top:

```md
---
title: My New Post
date: 2026-07-22
description: One-line summary of the post.
tags: web, javascript
---
```

3. Write your post content under the front matter.
4. Commit and push.

The action rebuilds everything automatically, including:

- post page generation
- homepage post index updates (via `data/posts.json`)
- `data/posts.json`
- sitemap and RSS updates

## Markdown Features Supported

- Headings
- Paragraphs
- Bold and italic
- Inline code and fenced code blocks
- Ordered and unordered lists
- Links and images
- Blockquotes
- Horizontal rules
- Tables