# Content Machine (Notion Blueprint)

## Database Schema

### Properties
- **Title** (Title)
- **Type** (Select: Blog, Twitter Thread, Video, Tutorial, Announcement)
- **Status** (Select: Idea, Drafting, Review, Scheduled, Posted)
- **Platform** (Multi-select: Twitter/X, LinkedIn, YouTube, Blog, Discord)
- **Product** (Select: BEARO, AlphaBuilder, Primape, Chimpanion, Ecosystem)
- **Author** (Person)
- **Publish Date** (Date)
- **Content** (Rich Text)
- **Assets** (Files & Media)
- **Links** (URL)
- **Engagement** (Number - likes/views)
- **Thread/Series** (Relation to self)

## Views

1. **Editorial Calendar** - Calendar view by Publish Date
2. **Kanban Board** - By Status (Idea → Drafting → Review → Posted)
3. **By Product** - Grouped by Product
4. **Performance** - Sorted by Engagement
5. **Ideas Backlog** - Filter Status = Idea

## Content Templates

- Product Update
- Technical Tutorial
- Community Spotlight
- Token/Economic Update
- Partnership Announcement

## Automation

- Status "Scheduled" + Date = Today → Post to Buffer/Hootsuite
- New content → Notify #marketing Slack
- Weekly metrics report
