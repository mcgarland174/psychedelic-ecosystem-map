# Psychedelic Ecosystem Map - Project Summary

## Overview

A fully functional, interactive web application for visualizing the psychedelic ecosystem network. Built with Next.js, TypeScript, and Tailwind CSS, using your Airtable data as the source.

## Current Status

✅ **COMPLETE AND RUNNING**

- Development server running at: **http://localhost:3000**
- All features implemented and tested
- Ready for deployment

## What Was Built

### 1. Interactive Network Visualization
- **Technology**: vis-network library
- **Features**:
  - Color-coded nodes by ecosystem role
  - Interactive pan, zoom, and click
  - Real-time filtering and search
  - Relationship lines showing org-to-org connections
  - Hover tooltips with organization info

### 2. Smart Filtering System
- Filter by ecosystem role (12+ categories)
- Real-time search by organization name
- Color legend for easy reference
- Filter combinations supported

### 3. Organization Detail Panel
- Displays when clicking any node
- Shows full organization information:
  - Name and ecosystem role
  - Organization type
  - Entity type (for-profit, nonprofit, etc.)
  - Location (city, state, country)
  - Website with clickable link

### 4. Embedded Airtable View
- Tab to switch between visualization and raw data
- Full Airtable functionality embedded
- Native sorting and filtering
- Always up-to-date with your base

### 5. Responsive Design
- Works on desktop and mobile
- Clean, modern UI with Tailwind CSS
- Accessible color scheme
- Professional styling throughout

## Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React)                   │
│  - Network Graph Component (vis-network)             │
│  - Filter Panel                                      │
│  - Organization Detail Panel                         │
│  - Airtable Embed                                    │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│            API Routes (Next.js App Router)           │
│  - /api/network-data  (graph data)                   │
│  - /api/organizations (org details)                  │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│            Airtable API Client (lib/airtable.ts)     │
│  - Fetches organizations                             │
│  - Fetches org-to-org affiliations                   │
│  - Transforms data for visualization                 │
└─────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────┐
│                  Airtable Database                   │
│  Base ID: appQkt2yYzVKhRaXx                          │
│  - Organizations table                               │
│  - Org to Org Affiliations table                     │
│  - People table                                      │
│  - Projects table                                    │
└─────────────────────────────────────────────────────┘
```

## File Structure

```
psychedelic-ecosystem-map/
├── app/
│   ├── api/
│   │   ├── network-data/route.ts     ← Graph data API
│   │   └── organizations/route.ts    ← Organizations API
│   ├── layout.tsx                    ← App layout
│   ├── page.tsx                      ← Main page with tabs
│   └── globals.css                   ← Global styles
├── components/
│   ├── NetworkGraph.tsx              ← Interactive graph
│   ├── FilterPanel.tsx               ← Filters & search
│   ├── OrgDetailPanel.tsx            ← Org details sidebar
│   └── AirtableEmbed.tsx             ← Embedded Airtable
├── lib/
│   └── airtable.ts                   ← Airtable API client
├── .env.local                        ← Environment variables
├── README.md                         ← Full documentation
├── DEPLOYMENT.md                     ← Deployment guide
├── QUICKSTART.md                     ← Quick start guide
└── PROJECT_SUMMARY.md                ← This file
```

## Data Flow

1. **User Opens App** → Page loads
2. **API Call** → `/api/network-data` fetches from Airtable
3. **Data Transform** → Converts to graph nodes and edges
4. **Render Graph** → vis-network displays interactive visualization
5. **User Filters** → Graph updates in real-time
6. **User Clicks Node** → Detail panel shows organization info

## Technologies Used

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework | 15.5.6 |
| TypeScript | Type safety | Latest |
| Tailwind CSS | Styling | 3.x |
| vis-network | Network visualization | Latest |
| Airtable SDK | Data source | Latest |
| React | UI library | 19.x |

## Features by Tab

### Network Visualization Tab
- ✅ Interactive force-directed graph
- ✅ Color-coded by ecosystem role
- ✅ Pan and zoom
- ✅ Click for details
- ✅ Filter by role
- ✅ Search by name
- ✅ Hover tooltips
- ✅ Node count display
- ✅ Legend

### Data View Tab
- ✅ Full Airtable embed
- ✅ Native Airtable functionality
- ✅ Sorting and filtering
- ✅ Always in sync with database

## Ecosystem Roles Supported

The app recognizes and visualizes these roles:

1. **Funder** - Philanthropic institutions, VCs, donors
2. **Media** - Journalists, outlets, communications
3. **Government & Policy** - Agencies, officials, policy advisors
4. **Academic & Research** - Universities, research institutes
5. **Training & Credentialing** - Education, certification bodies
6. **Clinical Services** - Therapeutic services, treatment
7. **Community & Peer Support** - Grassroots, peer support
8. **Spiritual / Religious** - Ceremonial, spiritual facilitators
9. **Advocacy** - Policy reform, legal advisors
10. **Technology & Data Systems** - Digital platforms, tools
11. **Industry & Supply Chain** - Manufacturing, distribution
12. **Cultural & Indigenous** - Traditional practice, preservation

## Performance Optimizations

- ✅ Server-side data fetching
- ✅ Dynamic imports for heavy components
- ✅ Client-side filtering (no API calls)
- ✅ Efficient graph rendering
- ✅ Optimized CSS bundle with Tailwind
- ✅ TypeScript for type safety and performance

## Security Features

- ✅ Environment variables for secrets
- ✅ API key stored server-side
- ✅ `.env.local` in `.gitignore`
- ✅ No sensitive data in client code
- ✅ HTTPS ready (on deployment)

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Next Steps

### Immediate (Ready Now)
1. ✅ Test locally at http://localhost:3000
2. ✅ Explore the visualization
3. ✅ Try filtering and search

### Short Term (Today/This Week)
1. Deploy to Vercel (see DEPLOYMENT.md)
2. Add custom domain
3. Share with team

### Medium Term (Optional Enhancements)
- Add more visualization modes (by geography, by project)
- Export graph as image
- Add user authentication
- Create shareable filtered views
- Add analytics tracking
- Enhanced mobile experience

### Long Term (Future Ideas)
- Add people network visualization
- Project timeline view
- Relationship strength indicators
- Advanced search with multiple filters
- Data export functionality
- API for external integrations

## Deployment Options

| Platform | Difficulty | Cost | Time |
|----------|-----------|------|------|
| Vercel | Easy | Free tier | 5 min |
| Netlify | Easy | Free tier | 10 min |
| AWS Amplify | Medium | Pay per use | 15 min |

**Recommended**: Deploy to Vercel (see DEPLOYMENT.md for step-by-step)

## Success Metrics

Track these after deployment:
- Page load time
- Graph render time
- Number of organizations displayed
- Filter performance
- User engagement (clicks, filters used)
- Mobile vs desktop usage

## Known Limitations

1. **Data Source**: Currently read-only from Airtable
2. **Large Networks**: Very large networks (1000+ nodes) may slow down
3. **Org Affiliations**: Requires "Org to Org Affiliations" table to show connections

## Support & Maintenance

### Regular Tasks
- Update Airtable API key as needed
- Monitor for new organizations
- Check for Next.js updates
- Review performance metrics

### Troubleshooting
- See README.md for common issues
- Check server logs for errors
- Verify Airtable API permissions

## Documentation Files

- **README.md** - Full technical documentation
- **DEPLOYMENT.md** - Step-by-step deployment guide
- **QUICKSTART.md** - 5-minute getting started guide
- **PROJECT_SUMMARY.md** - This overview document

## Contact & Resources

- **Live App**: http://localhost:3000 (local)
- **Airtable Base**: appQkt2yYzVKhRaXx
- **Next.js Docs**: https://nextjs.org/docs
- **vis-network Docs**: https://visjs.github.io/vis-network/

---

## Summary

✅ **Fully functional ecosystem map**
✅ **Interactive network visualization**
✅ **Smart filtering and search**
✅ **Organization details on click**
✅ **Embedded Airtable data view**
✅ **Ready for deployment**
✅ **Complete documentation**

**Next Action**: Test the app at http://localhost:3000, then deploy to Vercel!
