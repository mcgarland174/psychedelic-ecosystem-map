# How to Access V3 with All Updates

## ✅ All Changes Have Been Made to These Files:

### Modal Components (all in `/components/modals/`):
1. **FullMethodology.tsx** - Updated with:
   - 159 interviews (not 138)
   - 140 summit participants (not 50+)
   - Removed all dates from phases
   - Changed to monthly review cycles
   - Removed 2 bullets from Ongoing Refinement

2. **FAQ.tsx** - Updated with:
   - 159 interviews, 140 participants
   - Monthly review cycles
   - New answer for Q6 about current vs future functionality

3. **TheoryOfChangeMethodologyV3.tsx** - Updated with:
   - 159 interviews

### Page Files:
4. **change-pathways-v3/page.tsx** - Updated with:
   - Intro text: 159 interviews
   - Callout: "Built from 159 interviews, refined by 140 field leaders"

## 🌐 How to See the Changes:

### Option 1: Hard Refresh (Recommended)
1. Go to: `http://localhost:3000/change-pathways-v3`
2. **Hard refresh your browser**:
   - **Mac**: `Cmd + Shift + R` or `Cmd + Shift + Delete` (clear cache)
   - **Windows**: `Ctrl + Shift + R` or `Ctrl + F5`

### Option 2: Incognito/Private Window
1. Open an incognito/private browser window
2. Go to: `http://localhost:3000/change-pathways-v3`

### Option 3: Clear Browser Cache
1. Open browser settings
2. Clear cache and cookies
3. Go to: `http://localhost:3000/change-pathways-v3`

## 📊 What You Should See:

### On the Main Page:
- **Callout box**: "Built from 159 interviews, refined by 140 field leaders"
- **Intro text**: "159 in-depth interviews"

### In the "Full Methodology" Modal (Footer Link):
- **Phase 1**: "159 in-depth stakeholder interviews" (no dates)
- **Phase 4**: "140 field leaders at the psychedelic safety summit" (no dates)
- **Key Statistics**: 159 interviews, 140 summit participants
- **Ongoing Refinement**: "Monthly review" + only 2 bullets

### In the "FAQ" Modal (Footer Link):
- **Q3**: "159 stakeholder interviews... 140 field leaders"
- **Q4**: "monthly review cycles"
- **Q6**: New answer about current functionality requiring approval

### In the "How This Framework Was Developed" Modal:
- "159 in-depth interviews"

## ❗ If You Still Don't See the Changes:

The development server is running on port 3000 at:
- **Local**: `http://localhost:3000`

Make sure you're visiting:
- ✅ `http://localhost:3000/change-pathways-v3` (V3 with all updates)

NOT:
- ❌ `http://localhost:3000/change-pathways` (main version, not updated)
- ❌ `http://localhost:3000/change-pathways-v2` (V2 version)
- ❌ `http://localhost:3001` (different dev server)

## 🔍 To Verify the Code Changed:

You can verify the changes are in the code by checking any of these files:
```bash
# Check the V3 page has 159 interviews
grep "159" /Users/malcolmgarland/Desktop/psychedelic-ecosystem-map-backup/app/change-pathways-v3/page.tsx

# Check Full Methodology has 140 participants
grep "140" /Users/malcolmgarland/Desktop/psychedelic-ecosystem-map-backup/components/modals/FullMethodology.tsx

# Check FAQ has monthly reviews
grep "monthly" /Users/malcolmgarland/Desktop/psychedelic-ecosystem-map-backup/components/modals/FAQ.tsx
```

All should return results showing the updated numbers.

## 📝 Next Steps:

If you're satisfied with V3, you can:
1. Integrate it into the main `/change-pathways` page
2. Apply the same updates to the other 2 pages (Strategic Elements, Ecosystem Map)
3. Add the remaining features (card-level feedback buttons, "Start Your Journey" heading)
