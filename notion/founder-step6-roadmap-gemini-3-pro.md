# Step 6 — Roadmap Microsite Implementation

**Agent:** Gemini 3 Pro
**Date:** November 21, 2025
**Status:** Implemented
**Branch:** `step6-roadmap-gemini-3-pro`

## Overview

This microsite provides a public, immersive view of the BearifiedCo roadmap, aligned with the "One-Person $1B Company" vision. It fetches real-time data from the Notion "Product Roadmap" database and presents it in a scroll-driven narrative format.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** GSAP (ScrollTrigger)
- **Data Source:** Notion API (via `@notionhq/client`)
- **Icons:** Lucide React

## Integration Instructions

### 1. Environment Setup

Create a `.env.local` file in the `roadmap-site` directory with the following variables:

```bash
NOTION_API_KEY=secret_your_integration_token
NOTION_DATABASE_ID=2b264688-66ef-8093-a5bf-e0775e96abda
```

> **Note:** A mock data fallback is implemented, so the site will work for demonstration purposes even without these keys.

### 2. Notion Configuration

Ensure the "Product Roadmap" database (ID: `2b264688-66ef-8093-a5bf-e0775e96abda`) is shared with your Notion Integration connection.

### 3. Running Locally

```bash
cd roadmap-site
npm install
npm run dev
```

## Features

- **Scroll-Triggered Milestones:** Sections for $25M, $50M, $75M, and $100M market cap milestones.
- **Dynamic Roadmap Cards:** Pulls "Initiative", "Status", "Product", and "Priority" from Notion.
- **Parallax Animations:** Smooth entrance animations for text and cards using GSAP.
- **One-Person Unicorn Lore:** dedicated section with the narrative and quotes.
- **Responsive Design:** Optimized for mobile and desktop.

## Deployment

This project is ready for deployment on Vercel.

1.  Push the `roadmap-site` directory to GitHub.
2.  Import the project in Vercel.
3.  Add the `NOTION_API_KEY` and `NOTION_DATABASE_ID` environment variables in the Vercel dashboard.
4.  Deploy.

## Future Enhancements

- **Unlock Protocol Integration:** Add token-gating for the full roadmap view (UI placeholder ready).
- **Detailed Views:** Click on a card to see the full Notion page content (requires markdown rendering).

