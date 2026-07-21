---
title: Building a Lightweight Markdown Parser
date: 2026-07-23
description: How the custom parser converts markdown to safe static HTML.
tags: javascript, markdown, tooling
---

# Building a Lightweight Markdown Parser

The build script walks through the `posts/` directory and generates full post pages.

## Supported blocks

1. Headings
2. Paragraphs
3. Lists
4. Blockquotes
5. Code blocks

## Table support

| Feature | Supported |
| --- | --- |
| Headings | Yes |
| Tables | Yes |
| Libraries | No |

![Workspace illustration](../image_web.png)

The parser uses plain Node.js and no external dependencies.