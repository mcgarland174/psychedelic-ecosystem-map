# Quick Start Guide

Get your Psychedelic Ecosystem Map running in 5 minutes!

## What You'll Need

- Your Airtable API credentials (already in `.env.local`)
- A web browser
- Node.js installed

## Step 1: Start the Development Server

The app is already configured and dependencies are installed. Just run:

```bash
cd /Users/malcolmgarland/psychedelic-ecosystem-map
npm run dev
```

## Step 2: Open the App

Open your browser to: **http://localhost:3000**

## What You'll See

### Network Visualization Tab (Default View)

**Left Panel - Filters:**
- Search box to find organizations by name
- Dropdown to filter by Ecosystem Role
- Color legend showing what each color represents

**Center - Interactive Graph:**
- Each node (circle) = an organization
- Lines between nodes = relationships/affiliations
- Colors = ecosystem roles (blue = Funder, green = Academic, etc.)

**Interactions:**
- **Click & Drag**: Pan around the graph
- **Scroll**: Zoom in/out
- **Click a Node**: See organization details in right panel
- **Hover**: See organization name and info

**Right Panel (when node is clicked):**
- Organization name
- Ecosystem role(s)
- Location
- Website link
- Organization type

### Data View Tab

Click "Data View" at the top to see:
- Embedded Airtable view
- Full database with sorting and filtering
- All organization data in a table format

## Features to Try

1. **Filter by Role**:
   - Select "Funder" from dropdown
   - Graph shows only funding organizations

2. **Search**:
   - Type an organization name
   - Graph filters to matching results

3. **Explore Connections**:
   - Click any node
   - See how organizations are connected

4. **View Raw Data**:
   - Switch to "Data View" tab
   - Explore the full Airtable database

## Understanding the Colors

Each color represents an ecosystem role:

- 🔵 **Blue**: Funder
- 🔷 **Cyan**: Media
- 🟦 **Teal**: Government & Policy
- 🟢 **Green**: Academic & Research
- 🟡 **Yellow**: Training & Credentialing
- 🟠 **Orange**: Clinical Services
- 🔴 **Red**: Community & Peer Support
- 🌸 **Pink**: Spiritual / Religious
- 🟣 **Purple**: Advocacy
- ⚫ **Gray**: Technology & Data Systems
- 🔵 **Light Blue**: Industry & Supply Chain

## Common Tasks

### Find a Specific Organization
1. Use the search box in the left panel
2. Type the organization name
3. Click the node to see details

### See All Organizations in a Category
1. Use the "Ecosystem Role" dropdown
2. Select a category (e.g., "Academic & Research")
3. Graph filters to show only that category

### Explore Organization Relationships
1. Click any organization node
2. Look at the connected lines
3. Follow the lines to see related organizations

### View Detailed Data
1. Click "Data View" tab
2. Sort, filter, and explore in the embedded Airtable

## Next Steps

### Ready to Deploy?

See `DEPLOYMENT.md` for detailed instructions on deploying to:
- Vercel (recommended, easiest)
- Netlify
- AWS Amplify

### Want to Customize?

See `README.md` for:
- Changing colors
- Adjusting network physics
- Adding more filters
- Modifying the layout

## Troubleshooting

### Graph not showing?
- Check browser console (F12)
- Verify `.env.local` has correct API credentials
- Wait a few seconds for data to load

### "Failed to fetch" error?
- Check your Airtable API key is valid
- Verify the base ID is correct
- Check your internet connection

### Graph is cluttered?
- Use filters to narrow down results
- Zoom in on specific clusters
- Use search to find specific organizations

## Support

The app is running at: **http://localhost:3000**

To stop the server: Press `Ctrl + C` in the terminal

To start again: `npm run dev`

## What's Happening Behind the Scenes

1. **Data Loading**: App fetches organization data from Airtable
2. **Graph Building**: Creates network graph with vis-network
3. **Filtering**: Applies your selected filters in real-time
4. **Rendering**: Displays interactive visualization in your browser

All data stays private - it's only accessible to you with your API credentials!
