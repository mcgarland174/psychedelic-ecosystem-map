# Psychedelic Ecosystem Map

An interactive web application for visualizing the psychedelic ecosystem, including organizations, their relationships, projects, and programs.

## Features

- **Interactive Network Visualization**: Explore organizations as an interactive network graph with color-coded ecosystem roles
- **Smart Filtering**: Filter by ecosystem role, search by organization name
- **Organization Details**: Click any node to see detailed information about an organization
- **Embedded Data View**: Toggle to view raw Airtable data in an embedded view
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vis-network** - Interactive network visualization
- **Airtable API** - Data source

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Airtable account with API access
- Airtable Personal Access Token

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with:
```
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appQkt2yYzVKhRaXx
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
psychedelic-ecosystem-map/
├── app/
│   ├── api/
│   │   ├── network-data/route.ts    # API endpoint for graph data
│   │   └── organizations/route.ts   # API endpoint for org data
│   ├── layout.tsx
│   └── page.tsx                     # Main page with tabs
├── components/
│   ├── NetworkGraph.tsx             # Interactive network visualization
│   ├── FilterPanel.tsx              # Filter controls and legend
│   ├── OrgDetailPanel.tsx           # Organization detail sidebar
│   └── AirtableEmbed.tsx            # Embedded Airtable view
├── lib/
│   └── airtable.ts                  # Airtable API client
└── .env.local                       # Environment variables (not in git)
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`

### Deploy to Other Platforms

This is a standard Next.js app and can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any platform supporting Node.js

## Usage

### Network Visualization Tab

- **View**: Interactive graph showing organizations and their relationships
- **Filter by Role**: Use dropdown to filter by ecosystem role (Funder, Media, Academic, etc.)
- **Search**: Type to search for specific organizations
- **Click Nodes**: Click any organization to see details in the right panel
- **Navigate**: Use mouse to pan and zoom the network

### Data View Tab

- View and interact with the raw Airtable data
- Supports Airtable's native filtering and sorting

## Customization

### Colors

Ecosystem role colors are defined in `lib/airtable.ts` in the `getColorForRole` function. Modify these to change node colors.

### Network Physics

Network layout behavior can be adjusted in `components/NetworkGraph.tsx` in the `options.physics` section.

### Filters

Add more filter options in `components/FilterPanel.tsx`.

## Data Structure

The app expects the following Airtable tables:

- **Organizations**: Main organization data
- **Org to Org Affiliations**: Relationships between organizations
- **People**: Individual contacts (optional)
- **Projects**: Project data (optional)

## Troubleshooting

### "Failed to fetch network data"

- Check your `.env.local` file has correct API credentials
- Verify your Airtable Personal Access Token has proper permissions
- Check that the base ID matches your Airtable base

### Graph not rendering

- Ensure vis-network is properly installed: `npm install vis-network`
- Check browser console for errors
- Try clearing `.next` folder: `rm -rf .next && npm run dev`

## License

MIT
