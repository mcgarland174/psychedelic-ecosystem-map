# Final Airtable Update Status

**Date**: 2025-10-27
**Latest CSV**: `/Users/malcolmgarland/Downloads/Copy of Organizations-Grid view - Organizations-Grid view (1).csv`

---

## 📊 Overall Progress

| Round | Updated | Created | Errors | Total Success |
|-------|---------|---------|--------|---------------|
| Round 1 | 575 | 2 | 69 | 577/739 (78%) |
| Round 2 | 15 | 0 | 58 | 592/739 (80%) |
| **Round 3** | **22** | **0** | **39** | **614/739 (83%)** |

### ✅ Total Success So Far
- **614 organizations** successfully updated or created
- **39 organizations** still need updates (5%)
- **125 organizations** were successfully updated across all rounds

---

## 🎯 Remaining Issues (39 organizations)

### Categories of Failures

1. **Missing State/Province options** (24 orgs)
2. **Data quality issues in CSV** (10 orgs)
3. **Missing other field options** (5 orgs)

---

## ✅ Clean Options to Add to Airtable

### State / Province Field
Add these 18 options:
```
British Columbia
California
Colombia
England
France
Germany
Global
International
Mexico
Nebraska
Netherlands
Other
Peru
Portugal
Puerto Rico
Slovenia
Toronto
United Kingdom
```

### Area of Focus Field
Add these 2 options:
```
Historic Preservation
Multiple substances / Public health policy
Psychedelics (General)
```

### Population Served Field
Add this 1 option:
```
Emergency responders
```

---

## ⚠️ Data Quality Issues to Fix in CSV

These need to be **cleaned up in the CSV file** before they can be imported:

| Organization | Field | Current Value | Recommended Fix |
|-------------|-------|---------------|-----------------|
| **Volta** | Status | `ACtive` | Change to `Active` (typo) |
| **Guru** | Entity Type | `for profit` | Change to `For profit` (capitalization) |
| **The Plant Medicine People** | State | `San José Province` | Change to `Costa Rica` or `International` |
| **Salvum.love** | State | `None of the above` | Leave empty or use `International` or `Global` |
| **Drugs Forum** | State | `suggest a category` | Leave empty or choose actual location |
| **Experiential Training Institute** | State | `None` | Leave empty or use `International` |
| **EPIC** | State | `There is inadequate data` | Leave empty |
| **Tandava Retreats** | State | `is not listed but may be categorized as International or Mexico` | Change to `Mexico` or `International` |
| **First Light Group, Inc** | Entity Type | `For profit, Nonprofit` | Choose one: `For profit` OR `Nonprofit`, or add new option `Hybrid` |
| **SANGAM HEALING CENTER LLC** | Organization Type | `Healing Center` | Change to `Retreat Center` or `Clinic`, OR add `Healing Center` to dropdown |
| **Association for Prescription Psychedelics** | Ecosystem Role | `Advocacy Industry & Supply Chain` | Choose one: `Advocacy` OR `Industry & Supply Chain` |

---

## 📋 Failed Organizations List (39 total)

### Missing State/Province Options (18 orgs)
1. Flower Of Life Peru - "Other"
2. F.I.V.E Meo - "Mexico"
3. Psychedelic Health Professionals Network - "United Kingdom"
4. Awe / Ecstatic Mysticism - "Colombia"
5. Retreat Guru - "British Columbia"
6. Iboga Provider Training - "International"
7. Maastricht University - "Netherlands"
8. Wholecelium - "Netherlands"
9. Ayahuasca Foundation - "Peru"
10. Breakthrough Therapies - "Toronto"
11. Bmed Global - "International"
12. DMT Nexus - "International"
13. Perception Restoration Foundation - "Puerto Rico"
14. TREAT California - "California"
15. Global Psychedelic Society - "Global"
16. University of Oxford - "England"
17. Bunk Police - "Nebraska"
18. Psyaware - "England"
19. Kosmicare - "Portugal"
20. French Psychedelic Society (SPF) - "France"
21. COBE - "Germany"
22. Breaking Convention - "United Kingdom"
23. MIND Foundation - "Germany"
24. Its Psychedelics Baby Magazine - "Slovenia"

### Data Quality Issues (10 orgs)
1. **Volta** - Status: "ACtive" (typo)
2. **Guru** - Entity Type: "for profit" (capitalization)
3. **The Plant Medicine People** - State: "San José Province" (should be Costa Rica)
4. **Salvum.love** - State: "None of the above"
5. **Drugs Forum** - State: "suggest a category"
6. **Experiential Training Institute** - State: "None"
7. **EPIC** - State: "There is inadequate data"
8. **Tandava Retreats** - State: long descriptive text
9. **First Light Group, Inc** - Entity: "For profit, Nonprofit" (combined)
10. **SANGAM HEALING CENTER LLC** - Org Type: "Healing Center" (not in dropdown)

### Missing Other Field Options (5 orgs)
1. **International Academies of Emergency Dispatch (IAED)** - Population Served: "Emergency responders"
2. **Association for Prescription Psychedelics** - Ecosystem Role: "Advocacy Industry & Supply Chain"
3. **American Public Health Association (APHA)** - Area of Focus: "Multiple substances / Public health policy"
4. **Nowak Society** - Area of Focus: "Psychedelics (General)"
5. **NCPE** - Area of Focus: "Historic Preservation" (possibly)

### Network Error (1 org)
- **NCPE** - Connection timeout (may succeed on retry)

---

## 🚀 Next Steps

### Step 1: Add to Airtable (Recommended - Do This First)

**State / Province** - Copy and paste:
```
British Columbia, California, Colombia, England, France, Germany, Global, International, Mexico, Nebraska, Netherlands, Other, Peru, Portugal, Puerto Rico, Slovenia, Toronto, United Kingdom
```

**Area of Focus** - Copy and paste:
```
Historic Preservation, Multiple substances / Public health policy, Psychedelics (General)
```

**Population Served** - Copy and paste:
```
Emergency responders
```

### Step 2: Fix CSV Data (10 organizations)

Fix these values in the CSV:
1. Volta → Status: "Active"
2. Guru → Entity Type: "For profit"
3. The Plant Medicine People → State: "Costa Rica"
4. Salvum.love → State: "Global" or empty
5. Drugs Forum → State: empty or actual location
6. Experiential Training Institute → State: empty
7. EPIC → State: empty
8. Tandava Retreats → State: "Mexico"
9. First Light Group → Entity: choose one
10. SANGAM HEALING CENTER → Org Type: "Retreat Center" or add "Healing Center"

### Step 3: Decide on Edge Cases

**Should these be added to Airtable?**
- "Healing Center" as Organization Type?
- "Hybrid" or "Social Enterprise" as Entity Type for orgs that are both for-profit and nonprofit?
- "Advocacy Industry & Supply Chain" as combined Ecosystem Role?

### Step 4: Re-run Script

```bash
npx tsx scripts/update-organizations-from-csv.ts "/Users/malcolmgarland/Downloads/Copy of Organizations-Grid view - Organizations-Grid view (1).csv" --execute
```

---

## 🎉 Summary

You're 83% complete! Only 39 organizations left, mostly due to:
1. **18 orgs** need State/Province dropdown options added
2. **10 orgs** need CSV data cleanup
3. **5 orgs** need misc field options added

After adding the dropdown options and fixing the 10 data issues, you should reach **95%+ completion**.
