# Portfolio Style Document

## Purpose
This document captures the reusable style principles behind this portfolio so the same visual language can be applied to future projects.

Date: 2026-07-22

## Style Summary
The site uses a technical, polished, dark-interface aesthetic with bright cloud-inspired accents, soft motion, strong content hierarchy, and card-based presentation. The tone is professional first, with enough animation and glow to keep the interface from feeling flat.

## Core Principles
### 1. Dark technical canvas
- Use a deep navy background as the default page base.
- Keep surfaces slightly lighter than the page background to create layered depth.
- Avoid pure black; the current style works because the palette still feels airy.

### 2. Warm accent plus cool support color
- Use one dominant warm accent for primary actions and highlights.
- Pair it with one cool secondary accent for gradients, hover states, and animated emphasis.
- Keep the rest of the palette restrained so accent colors stay meaningful.

### 3. Monospace-led identity
- Use a code-oriented typeface across headings, body, and interface copy.
- Preserve readable sizing and generous line height so the monospace choice feels intentional rather than cramped.
- Prefer bold, compact headlines and muted supporting text.

### 4. Centered hero with restrained spectacle
- Open with a full-height hero section centered both vertically and horizontally.
- Use one animated background device such as particles or floating dots.
- Keep the hero layout simple: greeting, name, role, one sentence of value, and 2 to 3 actions.

### 5. Section rhythm through alternation
- Separate major sections with strong vertical spacing.
- Alternate dark background tones between sections instead of relying on heavy borders.
- Use consistent section headers: large title, short subtitle, centered alignment.

### 6. Card-based information blocks
- Present stats, skills, contact methods, and experience items as rounded cards.
- Use subtle elevation, low-contrast borders, and hover lift instead of loud outlines.
- Keep cards dense enough to feel professional, but not cramped.

### 7. Motion that supports scanning
- Use animation for staging and guidance, not for decoration alone.
- Prefer fade, slide, lift, and width-fill transitions.
- Stagger reveals lightly so users can track content groups without waiting on the interface.

### 8. Data display should feel operational
- Show skills, tools, and technologies as badges, progress bars, or compact grouped rows.
- Use visual patterns that resemble dashboards or engineering consoles, but keep them clean and minimal.

## Design Tokens To Reuse
These values reflect the current visual language and can be reused directly or adjusted slightly per project.

### Color system
- Background: `#0F172A`
- Surface: `#1E293B`
- Primary accent: `#FF9900`
- Secondary accent: `#14B8A6`
- Main text: `#E2E8F0`
- Muted text: `#94A3B8`
- Border: `#334155`
- Shadow tint: `rgba(15, 23, 42, 0.3)`

### Typography
- Primary font family: `"Source Code Pro", monospace`
- Headings: bold, large, compact line height
- Body copy: medium size, comfortable spacing, muted color by default

### Layout
- Max content width: `1200px`
- Standard horizontal padding: `20px`
- Section padding: `100px 0`
- Border radius: `12px`

### Motion
- Default transition: `0.3s ease`
- Slower reveal transition: `0.5s ease`
- Reveals: `0.8s ease`
- Progress animations: around `2s ease`

## Composition Rules
### Navigation
- Keep navigation fixed at the top.
- Use a compact bar with a small text logo and minimal links.
- Active and hover states should be handled with color plus a thin underline.

### Hero
- Keep the name as the strongest element on the page.
- Use a gradient treatment only on the primary identity text, not across the whole section.
- Use button pairs: one filled primary, one outlined secondary.

### About section
- Pair personal summary text with a circular profile image.
- Support the summary with small metric cards to add credibility quickly.
- Keep the copy practical and skill-oriented rather than autobiographical.

### Skills section
- Group skills into categories instead of a single long list.
- Use icons sparingly and only where they improve recognition.
- Favor progress bars, tags, or compact rows over large decorative graphics.

### Experience section
- Use a timeline or stacked-card pattern to frame professional history.
- Each entry should include role, organization, time range, concise achievement bullets, and technology tags.
- Tags should feel operational and lightweight, with rounded pill shapes.

### Contact section
- Present contact methods as clear cards with icon, label, and actionable value.
- Social links should be circular, evenly spaced, and easy to scan.
- Use a subtle background texture or radial glow to distinguish the section.

### Footer
- Keep the footer minimal and quiet.
- Use muted text and simple ownership or build-credit lines.

## Interaction Rules
- Hover states should slightly lift cards, buttons, and tags.
- Primary buttons may shift toward the secondary accent on hover.
- Secondary buttons should remain outlined until interaction.
- Scroll behavior should feel guided: smooth anchor jumps, active nav state, and on-scroll reveals.
- Loading states should be brief, clean, and visually consistent with the palette.

## Responsive Rules
- Preserve the same visual identity on mobile instead of simplifying to a generic layout.
- Collapse multi-column layouts into one column below tablet widths.
- Convert navigation into a hamburger menu for smaller screens.
- Stack hero actions vertically on mobile.
- Reduce section padding at small widths, but keep generous spacing between content blocks.

## Content Voice Rules
- Write in a precise, capability-first tone.
- Prefer short value statements over long narrative paragraphs.
- Use subtitles that feel confident and specific.
- Keep technology names visible and scannable.

## Implementation Guidance For New Projects
### Reuse directly
- The dark navy and slate palette
- A monospace-forward typography system
- Section alternation using background tones
- Card lift, soft shadows, rounded corners, and clean spacing
- Primary-plus-secondary accent pairing
- Subtle motion for reveal and emphasis

### Adapt per project
- Hero messaging and CTA labels
- Section order and information density
- Choice of background effect
- Timeline versus grid presentation for case studies or work history

### Do not copy forward
- Unused UI patterns that are not present in markup
- Duplicate style blocks
- Token names that are not actually defined
- Placeholder SEO or domain values

## Reusable CSS Starter
```css
:root {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-primary: #FF9900;
  --color-secondary: #14B8A6;
  --color-text: #E2E8F0;
  --color-text-muted: #94A3B8;
  --color-border: #334155;
  --shadow-color: rgba(15, 23, 42, 0.3);
  --font-heading: "Source Code Pro", monospace;
  --font-body: "Source Code Pro", monospace;
  --section-padding: 100px 0;
  --container-padding: 0 20px;
  --border-radius: 12px;
  --transition: all 0.3s ease;
}
```

## Quick Checklist For Future Builds
- Use one dark base and one lighter surface tone.
- Limit accents to one warm and one cool color.
- Keep headings bold and content blocks compact.
- Use cards, tags, and progress indicators instead of large illustrations.
- Animate entry, hover, and state changes lightly.
- Maintain strong spacing rhythm between sections.
- Keep mobile layout stacked, centered, and clean.
- Audit for leftover placeholder content before shipping.

## Final Rule
The visual language should feel like an engineer's portfolio made premium: structured, sharp, dependable, and lightly animated, never noisy or trend-chasing.