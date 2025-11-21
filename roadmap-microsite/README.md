# BearifiedCo Roadmap Microsite

A scroll-driven, animated microsite showcasing the BearifiedCo roadmap, token vision, and the "One-Person $1B Company" narrative.

## Features

- **Scroll-driven animations** using GSAP ScrollTrigger
- **Parallax effects** for immersive storytelling
- **Real-time Notion integration** via API
- **Responsive design** for all devices
- **Milestone sections** for $25M, $50M, $75M, $100M market cap
- **Vision section** with One-Person $1B Company narrative

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **GSAP ScrollTrigger** - Scroll animations
- **Tailwind CSS** - Styling
- **Notion API** - Roadmap data source

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Add your Notion API key to `.env`:
```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `NOTION_API_KEY` environment variable
4. Deploy

### Other Platforms

Build the project:
```bash
npm run build
npm start
```

## Roadmap Data

The microsite pulls data from the Notion Product Roadmap database:
- Database ID: `2b26468866ef8093a5bfe0775e96abda`
- Updates automatically when Notion data changes

## Customization

- Edit milestone sections in `src/pages/index.tsx`
- Modify animations in component files (`src/components/`)
- Update styles in `src/styles/globals.css` and `tailwind.config.js`

## License

Copyright © 2025 BearifiedCo

