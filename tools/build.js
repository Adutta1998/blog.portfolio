"use strict";

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const postsDir = path.join(rootDir, "posts");
const blogDir = path.join(rootDir, "blog");
const dataDir = path.join(rootDir, "data");

const config = {
  siteTitle: "Avinaba Dutta",
  siteDescription: "Personal blog and writing archive by Avinaba Dutta.",
  siteUrl: process.env.SITE_URL || "https://adutta.top",
  postsPath: "blog"
};

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseFrontMatter(content) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { metadata: {}, body: normalized };
  }

  const rawMeta = match[1].trim();
  const body = normalized.slice(match[0].length);
  const metadata = {};

  rawMeta.split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(":");
    if (separator < 1) {
      return;
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    const cleanValue = rawValue.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    metadata[key] = cleanValue;
  });

  return { metadata, body };
}

function parseInline(markdownText) {
  let text = escapeHtml(markdownText);
  text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g, (_, alt, src, title) => {
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
    return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${titleAttr}>`;
  });
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
  });
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return text;
}

function isHr(line) {
  const trimmed = line.trim();
  return /^(-{3,}|\*{3,})$/.test(trimmed);
}

function parseTable(lines, startIndex) {
  const header = lines[startIndex];
  const separator = lines[startIndex + 1];
  if (!header || !separator) {
    return null;
  }

  if (!header.includes("|") || !/^\s*\|?\s*[-:| ]+\|?\s*$/.test(separator)) {
    return null;
  }

  const parseRow = (row) => row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => parseInline(cell.trim()));

  const headers = parseRow(header);
  const bodyRows = [];
  let i = startIndex + 2;

  while (i < lines.length && lines[i].includes("|")) {
    bodyRows.push(parseRow(lines[i]));
    i += 1;
  }

  const thead = `<thead><tr>${headers.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${bodyRows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;

  return {
    html: `<table>${thead}${tbody}</table>`,
    nextIndex: i
  };
}

function parseMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const htmlParts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const language = trimmed.slice(3).trim();
      const codeLines = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      const languageClass = language ? ` class="language-${escapeHtml(language)}"` : "";
      htmlParts.push(`<pre><code${languageClass}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    if (isHr(line)) {
      htmlParts.push("<hr>");
      i += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${parseInline(headingMatch[2].trim())}</h${level}>`);
      i += 1;
      continue;
    }

    const table = parseTable(lines, i);
    if (table) {
      htmlParts.push(table.html);
      i = table.nextIndex;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      htmlParts.push(`<blockquote><p>${parseInline(quoteLines.join(" "))}</p></blockquote>`);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      htmlParts.push(`<ul>${items.map((item) => `<li>${parseInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i += 1;
      }
      htmlParts.push(`<ol>${items.map((item) => `<li>${parseInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraphLines = [trimmed];
    i += 1;
    while (i < lines.length && lines[i].trim()) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }
    htmlParts.push(`<p>${parseInline(paragraphLines.join(" "))}</p>`);
  }

  return htmlParts.join("\n");
}

function toIsoDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

function formatHumanDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function parseTags(rawTags) {
  if (!rawTags) {
    return [];
  }
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stripLeadingTitleHeading(contentHtml) {
  if (/^<h1>.*?<\/h1>\s*/.test(contentHtml)) {
    return contentHtml.replace(/^<h1>.*?<\/h1>\s*/, "");
  }
  return contentHtml;
}

function htmlToText(contentHtml) {
  return contentHtml
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDescription(metadataDescription, contentHtml) {
  if (metadataDescription && metadataDescription.trim()) {
    return metadataDescription.trim();
  }

  const text = htmlToText(contentHtml);
  if (!text) {
    return "";
  }

  if (text.length <= 160) {
    return text;
  }

  return `${text.slice(0, 157)}...`;
}

function joinUrl(base, pathname) {
  const normalizedBase = base.replace(/\/$/, "");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${normalizedBase}${normalizedPath}`;
}

function buildPageTemplate(pageTitle, description, bodyContent, currentPage) {
  const isHome = currentPage === "home";
  const isPosts = currentPage === "posts";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="stylesheet" href="../css/styles.css">
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" href="../index.html" aria-label="Homepage">${escapeHtml(config.siteTitle)}</a>
        <button class="menu-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>
        <nav id="primary-nav" class="primary-nav" aria-label="Main navigation">
          <ul>
            <li><a ${isHome ? "aria-current=\"page\"" : ""} href="../index.html">Home</a></li>
            <li><a ${isPosts ? "aria-current=\"page\"" : ""} href="../index.html#posts">Posts</a></li>
          </ul>
        </nav>
      </div>
    </header>
    ${bodyContent}
    <footer class="site-footer">
      <div class="container footer-inner">
        <p><span id="copyright-year"></span> ${escapeHtml(config.siteTitle)}</p>
        <a href="../index.html#posts">Browse all posts</a>
      </div>
    </footer>
    <script src="../js/site.js" defer></script>
  </body>
</html>`;
}

function buildPostPage(post, previousPost, nextPost) {
  const tagMarkup = post.tags.length
    ? `<div class="tags" aria-label="Tags">${post.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
    : "";

  const previousLink = previousPost
    ? `<a rel="prev" href="${escapeHtml(`${previousPost.slug}.html`)}">Previous: ${escapeHtml(previousPost.title)}</a>`
    : "";
  const nextLink = nextPost
    ? `<a rel="next" href="${escapeHtml(`${nextPost.slug}.html`)}">Next: ${escapeHtml(nextPost.title)}</a>`
    : "";

  const body = `<main id="main-content" class="post-layout">
      <div class="container">
        <article class="post-article">
          <header>
            <h1>${escapeHtml(post.title)}</h1>
            <p class="meta">Published ${escapeHtml(formatHumanDate(post.date))}</p>
            ${tagMarkup}
          </header>
          ${post.contentHtml}
          <nav class="post-nav" aria-label="Post navigation">
            ${previousLink}
            ${nextLink}
          </nav>
        </article>
      </div>
    </main>`;

  return buildPageTemplate(`${post.title} | ${config.siteTitle}`, post.description, body, "posts");
}

function buildRss(posts) {
  const rssItems = posts
    .map((post) => {
      const postUrl = joinUrl(config.siteUrl, post.url);
      const pubDate = new Date(post.date).toUTCString();
      return `<item>
  <title>${escapeHtml(post.title)}</title>
  <link>${escapeHtml(postUrl)}</link>
  <guid>${escapeHtml(postUrl)}</guid>
  <pubDate>${escapeHtml(pubDate)}</pubDate>
  <description>${escapeHtml(post.description)}</description>
</item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeHtml(config.siteTitle)} Blog</title>
  <link>${escapeHtml(config.siteUrl)}</link>
  <description>${escapeHtml(config.siteDescription)}</description>
  ${rssItems}
</channel>
</rss>`;
}

function buildSitemap(posts) {
  const urls = ["/", ...posts.map((post) => `/${post.url}`)];
  const today = new Date().toISOString();

  const content = urls
    .map((item) => `<url><loc>${escapeHtml(config.siteUrl + item)}</loc><lastmod>${escapeHtml(today)}</lastmod></url>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${content}
</urlset>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml
`;
}

function getMarkdownFiles() {
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  return fs
    .readdirSync(postsDir)
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .map((name) => path.join(postsDir, name));
}

function buildPosts() {
  const markdownFiles = getMarkdownFiles();
  const posts = markdownFiles.map((filePath) => {
    const markdown = readFile(filePath);
    const parsed = parseFrontMatter(markdown);
    const fileSlug = slugify(path.basename(filePath, path.extname(filePath)));
    const title = parsed.metadata.title || fileSlug.replace(/-/g, " ");
    const slug = parsed.metadata.slug ? slugify(parsed.metadata.slug) : fileSlug;
    const date = parsed.metadata.date || "1970-01-01";
    const isoDate = toIsoDate(date);
    const renderedHtml = parseMarkdown(parsed.body);
    const contentHtml = stripLeadingTitleHeading(renderedHtml);
    const description = buildDescription(parsed.metadata.description, contentHtml);

    return {
      title,
      slug,
      date: isoDate || new Date(0).toISOString(),
      description,
      tags: parseTags(parsed.metadata.tags),
      contentHtml,
      url: `${config.postsPath}/${slug}.html`
    };
  });

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

function cleanGeneratedPostPages(validSlugs) {
  if (!fs.existsSync(blogDir)) {
    return;
  }

  const files = fs.readdirSync(blogDir);
  files
    .filter((file) => file.endsWith(".html"))
    .forEach((file) => {
      const slug = path.basename(file, ".html");
      if (!validSlugs.has(slug)) {
        fs.unlinkSync(path.join(blogDir, file));
      }
    });
}

function runBuild() {
  ensureDir(blogDir);
  ensureDir(dataDir);

  const posts = buildPosts();
  const slugs = new Set(posts.map((post) => post.slug));
  cleanGeneratedPostPages(slugs);

  posts.forEach((post, index) => {
    const previousPost = index < posts.length - 1 ? posts[index + 1] : null;
    const nextPost = index > 0 ? posts[index - 1] : null;
    const postHtml = buildPostPage(post, previousPost, nextPost);
    writeFile(path.join(blogDir, `${post.slug}.html`), postHtml);
  });

  const blogListingPath = path.join(rootDir, "blog.html");
  if (fs.existsSync(blogListingPath)) {
    fs.unlinkSync(blogListingPath);
  }
  writeFile(path.join(dataDir, "posts.json"), `${JSON.stringify(posts, null, 2)}\n`);
  writeFile(path.join(rootDir, "rss.xml"), buildRss(posts));
  writeFile(path.join(rootDir, "sitemap.xml"), buildSitemap(posts));
  writeFile(path.join(rootDir, "robots.txt"), buildRobots());

  process.stdout.write(`Built ${posts.length} post(s).\n`);
}

runBuild();