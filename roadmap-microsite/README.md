# BearifiedCo Roadmap Microsite

A scroll-driven, animated microsite showcasing BearifiedCo's roadmap and the "One-Person $1B Company" vision. Built with Next.js, GSAP ScrollTrigger, and Notion API integration.

## Features

- **Scroll-Driven Animations**: Smooth scroll-triggered animations using GSAP ScrollTrigger
- **Notion Integration**: Automatically pulls roadmap data from Notion Product Roadmap database
- **Milestone Sections**: Visual sections for $25M, $50M, $75M, $100M market cap milestones
- **Vision Narrative**: Inspirational "One-Person $1B Company" section with quotes and stats
- **Token Gating**: Optional Web3 wallet integration for exclusive content (Unlock Protocol ready)
- **Responsive Design**: Mobile-first design that works on all devices
- **Parallax Effects**: Layered parallax backgrounds for depth

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP 3.12+ with ScrollTrigger plugin
- **Data Source**: Notion API (@notionhq/client)
- **Deployment**: Vercel-ready

## Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment Variables**

Copy `.env.example` to `.env.local` and add your Notion API key:

```bash
cp .env.example .env.local
```

Get your Notion API key from [Notion Integrations](https://www.notion.so/my-integrations).

3. **Update Notion Database ID**

The roadmap database ID is configured in `app/api/roadmap/route.ts`. Update if needed:

```typescript
const ROADMAP_DATABASE_ID = '2b26468866ef8093a5bfe0775e96abda'
```

4. **Run Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the microsite.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `NOTION_API_KEY` environment variable
4. Deploy

### Other Platforms

The site is a standard Next.js app and can be deployed to:
- Netlify
- Railway
- AWS Amplify
- Any Node.js hosting platform

## Project Structure

```
roadmap-microsite/
├── app/
│   ├── api/
│   │   └── roadmap/
│   │       └── route.ts          # Notion API integration
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main page component
│   └── globals.css                # Global styles
├── components/
│   ├── HeroSection.tsx            # Hero section with parallax
│   ├── MilestoneSection.tsx       # Milestone sections ($25M-$100M)
│   ├── VisionSection.tsx          # One-Person $1B narrative
│   ├── RoadmapSection.tsx         # Full roadmap view
│   └── TokenGate.tsx              # Web3 wallet connection
└── public/                        # Static assets
```

## Customization

### Milestone Mapping

Update milestone filtering in `app/page.tsx`:

```typescript
roadmapItems: roadmapData.filter((item) => 
  item.milestone === 'Milestone 1'
),
```

### Colors & Styling

Modify `tailwind.config.js` to change color scheme and fonts.

### Animation Timing

Adjust GSAP animation durations and triggers in component `useEffect` hooks.

## Token Gating (Optional)

To enable token gating:

1. Set up Unlock Protocol lock
2. Update `TokenGate.tsx` to check token balance
3. Implement Unlock SDK integration

See [Unlock Protocol Docs](https://docs.unlock-protocol.com/) for details.

## Notion Database Schema

The microsite expects a Notion database with these properties:

- **Initiative** (Title)
- **Product** (Select)
- **Milestone** (Select)
- **Status** (Status)
- **Priority** (Select)
- **Project** (Text)
- **Start Date** (Date)
- **Due Date** (Date)
- **Description** (Text)
- **Owner** (Person)
- **Notes** (Text)

## Performance

- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT

## Credits

Built for BearifiedCo as part of FounderOS Step 6 implementation.

