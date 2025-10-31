# Remaining Dropdown Options to Add to Airtable

**Status**: 58 organizations still need updates
**Progress**: 15 organizations were successfully updated this round

---

## Required Actions

### ✅ Clean Options to Add to Airtable

These are legitimate values that should be added as dropdown options:

**State / Province field - Add these:**
```
Alabama, British Columbia, California, Colombia, England, Florida, France, Germany, Global, Halifax, Hawaii, Illinois, International, Mexico, Michigan, Minnesota, Netherlands, Other, Peru, Portugal, Puerto Rico, Queensland, Slovenia, Toronto, United Kingdom, Utah, Virginia, Washington
```

**Area of Focus field - Add this:**
```
Multiple substances / Public health policy, Psychedelics (General)
```

---

### ⚠️ Data Issues Still in CSV - Need Manual Cleanup

These values should be **cleaned up in the CSV** before adding to Airtable:

| Current Value in CSV | Field | Recommended Fix |
|---------------------|-------|-----------------|
| `for profit` | Entity Type | Change to `For profit` (capital F) |
| `CA` | State / Province | Change to `California` |
| `Lincoln` | State / Province | Change to proper state (Nebraska?) or city name |
| `London` | State / Province | Change to `England` or `United Kingdom` |
| `San José Province` | State / Province | Change to `Costa Rica` |
| `None` | State / Province | Leave field empty or use `International` |
| `None of the above` | State / Province | Leave field empty or use `International` |
| `suggest a category` | State / Province | Leave field empty or choose proper value |
| `There is inadequate data` | State / Province | Leave field empty |
| `is not listed but may be categorized as International or Mexico` | State / Province | Choose `International` or `Mexico` |
| `For profit, Nonprofit` | Entity Type | Choose one value or add `Hybrid` as new option |
| `Healing Center` | Organization Type | Add to dropdown OR change to `Retreat Center` or `Clinic` |
| `Advocacy Industry & Supply Chain` | Ecosystem Role | Choose one: `Advocacy` OR `Industry & Supply Chain` |

---

## Organizations Still Failing (58 total)

### Need State/Province Options (44 orgs)
- **International locations**: Colombia (1), England (1), France (1), Germany (2), International (2), Mexico (1), Netherlands (2), Peru (1), Portugal (1), Slovenia (1), United Kingdom (2)
- **US States**: Alabama (1), California (1), Florida (4), Hawaii (1), Illinois (4), Michigan (3), Minnesota (1), Utah (1), Virginia (3), Washington (1)
- **Canadian/Australian**: British Columbia (1), Halifax (1 - for Volta), Quebec (0), Toronto (1)
- **Other**: Puerto Rico (1)

### Need Data Cleanup (13 orgs)
1. **Guru** - Entity Type: "for profit" → "For profit"
2. **Evolve Ventures and Foundation** - State: "CA" → "California"
3. **Bunk Police** - State: "Lincoln" → proper state
4. **Psyaware** - State: "London" → "England" or "United Kingdom"
5. **The Plant Medicine People** - State: "San José Province" → "Costa Rica"
6. **Experiential Training Institute** - State: "None" → empty or proper value
7. **Salvum.love** - State: "None of the above" → empty or proper value
8. **Drugs Forum** - State: "suggest a category" → empty or proper value
9. **EPIC** - State: "There is inadequate data" → empty
10. **Tandava Retreats** - State: long text → "International" or "Mexico"
11. **First Light Group, Inc** - Entity: "For profit, Nonprofit" → choose one
12. **SANGAM HEALING CENTER LLC** - Org Type: "Healing Center" → add option or change
13. **Association for Prescription Psychedelics** - Role: combined → choose one

### Need Area of Focus Options (2 orgs)
- **American Public Health Association (APHA)** - "Multiple substances / Public health policy"
- **Nowak Society** - "Psychedelics (General)"

---

## Quick Action Plan

### Step 1: Add to Airtable (Do This Now)

Go to Airtable → Organizations table → Field settings:

**State / Province** - Add these 27 options:
```
Alabama
British Columbia
California
Colombia
England
Florida
France
Germany
Global
Halifax
Hawaii
Illinois
International
Mexico
Michigan
Minnesota
Netherlands
Other
Peru
Portugal
Puerto Rico
Queensland
Slovenia
Toronto
United Kingdom
Utah
Virginia
Washington
```

**Area of Focus** - Add these 2 options:
```
Multiple substances / Public health policy
Psychedelics (General)
```

### Step 2: Fix CSV Data (13 organizations)

Open the CSV and fix these values:
1. Find "Guru" → change Entity Type from "for profit" to "For profit"
2. Find "Evolve Ventures" → change State from "CA" to "California"
3. Find "Bunk Police" → change State from "Lincoln" to proper state
4. Find "Psyaware" → change State from "London" to "England"
5. Find "The Plant Medicine People" → change State to "Costa Rica"
6. Find orgs with "None", "None of the above", "suggest a category", etc. → empty or proper value
7. Find "Tandava Retreats" → change State to "Mexico"
8. Find "First Light Group" → choose "For profit" or "Nonprofit"
9. Find "SANGAM HEALING CENTER" → change Org Type to "Retreat Center" or add "Healing Center"
10. Find "Association for Prescription Psychedelics" → choose "Advocacy"

### Step 3: Re-run Script

After Steps 1 & 2:
```bash
npx tsx scripts/update-organizations-from-csv.ts "/Users/malcolmgarland/Downloads/Copy of Organizations-Grid view - Organizations-Grid view.csv" --execute
```

---

## Progress Summary

- ✅ **First run**: 577/739 organizations updated (78%)
- ✅ **Second run**: 15 more organizations updated
- ⏳ **Remaining**: 58 organizations (8%)

Most remaining issues are missing State/Province values that just need to be added to Airtable dropdowns.
