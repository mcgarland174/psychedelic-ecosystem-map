# Airtable Organization Update Report

**Date**: 2025-10-27
**Source**: `/Users/malcolmgarland/Desktop/Copy of Organizations-Grid view - Organizations-Grid view.csv`

## Summary

✅ **Successfully Updated**: 575 organizations
✅ **Successfully Created**: 2 new organizations
⚠️ **Failed**: 69 organizations (need manual review)

## New Organizations Created

1. **Take 3 Presents** - Event Producer, For profit
2. **New Approach** - Advocacy Organization, Nonprofit

## Update Results

### What Was Updated

The script updated the following fields from the CSV (preserving all other Airtable data):
- Organization Name
- Organization Type
- Entity Type
- Ecosystem Role
- Website
- State / Province
- Country
- Area of Focus
- Substance of Focus
- Population Served
- Status
- Description of Activities

### What Was Preserved

The following Airtable-only fields were **NOT** modified:
- City
- Affiliated People
- Org to Org Affiliations
- Projects
- Show Online
- Verified
- Influence
- Credibility
- Sub Category (migrating)
- Primary Category (migrating)
- People & Roles
- Users

## Failed Updates (69 organizations)

These organizations failed because their CSV data contains values that don't exist in Airtable's dropdown options. You'll need to manually add these options in Airtable first, then re-run the script.

### Missing State/Province Options

**International Locations** (need to be added):
- Colombia, England, France, Germany, International, Mexico, Netherlands, Peru, Portugal, Slovenia, Switzerland, United Kingdom

**US States** (need to be added):
- Alabama, California, Florida, Hawaii, Illinois, Michigan, Minnesota, Utah, Virginia, Washington

**Canadian/Australian** (need to be added):
- Halifax, Queensland, Toronto

**Other State Values** (typos or special cases):
- "None of the above"
- "None"
- "Other"
- "suggest a category"
- "There is inadequate data"
- "is not listed but may be categorized as International or Mexico"
- "CA" (should be "California"?)
- "NY" (should be "New York"?)
- "Lincoln" (city, not state?)
- "London" (city, not state?)

### Missing Entity Type Options

- "for profit" (lowercase - should match "For profit"?)
- "For profit, Nonprofit" (combined value)
- "Healing Center" (might belong in Organization Type?)

### Missing Ecosystem Role Options

- "Advocacy Industry & Supply Chain"
- "FUnders" (typo? should be "Funder"?)

### Missing Population Served Options

- "Adults"
- "Out-of-state visitors (healing tourism)" (appears 4 times)
- "People who use drugs"

### Missing Substance of Focus Options

- "Sassafras / MDA" (appears 2 times)

### Missing Area of Focus Options

- "Multiple substances / Public health policy"
- "Psychedelics (General)"

### Missing Status Options

- "Acyive" (typo - should be "Active")

## Failed Organizations List

1. Flower Of Life Peru - State: "Other"
2. Iboga Provider Training - State: "International"
3. Guru - Entity Type: "for profit"
4. Psychedelic Health Professionals Network - State: "United Kingdom"
5. Harm Reduction Circle - Population: "People who use drugs"
6. Awe / Ecstatic Mysticism - State: "Colombia"
7. F.I.V.E Meo - State: "Mexico"
8. NCPE - State: "Illinois"
9. The Plant Medicine People - State: "San José Province"
10. KRIYA - State: "Florida"
11. Ayahuasca Foundation - State: "Peru"
12. Salvum.love - State: "None of the above"
13. American Board of Emergency Medicine (ABEM) - State: "Michigan"
14. Maastricht University - State: "Netherlands"
15. Emergence Benefactors - State: "Alabama"
16. Association of Public-Safety Communications Officials International (APCO) - State: "Florida"
17. International Academies of Emergency Dispatch (IAED) - State: "Utah"
18. Wholecelium - State: "Netherlands"
19. Ketamine Academy - State: "Florida"
20. Bmed Global - State: "International"
21. Experiential Training Institute - State: "None"
22. Perception Restoration Foundation - State: "Puerto Rico"
23. Breakthrough Therapies - State: "Toronto"
24. National Network of Depression Centers (NNDC) - State: "Michigan"
25. TREAT California - State: "California"
26. Drugs Forum - State: "suggest a category"
27. DMT Nexus - State: "International"
28. Centre for Medicine Assisted Therapy - State: "Virginia"
29. Tandava Retreats - State: "is not listed but may be categorized as International or Mexico"
30. American Hospital Association (AHA) - State: "Illinois"
31. Kosmicare - State: "Portugal"
32. National Alliance on Mental Illness (NAMI) - State: "Virginia"
33. Conscious Insights - State: "Queensland"
34. Bunk Police - State: "Lincoln"
35. University of Oxford - State: "England"
36. Psyaware - State: "London"
37. Global Psychedelic Society - State: "Global"
38. SNaP Lab - State: "Illinois"
39. American Center for the Integration of Spiritually Transformative Experiences - State: "Hawaii"
40. Sounds Powerful Productions - State: "Minnesota"
41. Mycotopia - State: "Florida"
42. French Psychedelic Society (SPF) - State: "France"
43. American Public Health Association (APHA) - Area: "Multiple substances / Public health policy"
44. COBE - State: "Germany"
45. Reveal - State: "Illinois"
46. Volta - State: "Halifax"
47. Association for Prescription Psychedelics - Role: "Advocacy Industry & Supply Chain"
48. EPIC - State: "There is inadequate data"
49. First Light Group, Inc - Entity: "For profit, Nonprofit"
50. SANGAM HEALING CENTER LLC - Type: "Healing Center"
51. PSYLOCYBIN HEALING CENTERS OF COLORADO INC - Status: "Acyive"
52. Office of the Army Surgeon General - State: "Virginia"
53. Luke Nosek & Nicole Nosek - Role: "FUnders"
54. MIND Foundation - State: "Germany"
55. Evolve Ventures and Foundation - State: "CA"
56. Its Psychedelics Baby Magazine - State: "Slovenia"
57. Shroom Circle - State: "Switzerland"
58. PNW Spore - State: "Washington"
59. Fetzer Institute - State: "Michigan"
60. Sacred Plant Alliance - Substance: "Sassafras / MDA"
61. Psychable - Substance: "Sassafras / MDA"
62. Breaking Convention - State: "United Kingdom"
63. Four Corners Ketamine Center - Population: "Adults"
64. Nowak Society - Area: "Psychedelics (General)"
65. Sabba Collective (PBC) - State: "NY"
66. Odyssey PBC - Population: "Out-of-state visitors (healing tourism)"
67. Oregon Health Authority - Population: "Out-of-state visitors (healing tourism)"
68. EPIC (Ethical Psychedelic International Community) - Population: "Out-of-state visitors (healing tourism)"
69. PsyTrack - Population: "Out-of-state visitors (healing tourism)"

## Recommendations

1. **Add Missing State/Province Options**: Review the list of international locations and US states above, add them to Airtable's State/Province field options.

2. **Fix Data Issues in CSV**:
   - "Acyive" → "Active" (typo)
   - "for profit" → "For profit" (capitalization)
   - "FUnders" → "Funder" (typo)
   - "CA" → "California"
   - "NY" → "New York"

3. **Decide on Special Cases**:
   - Should "Healing Center" be an Entity Type or Organization Type?
   - Should combined values like "For profit, Nonprofit" be allowed?
   - Should descriptive text like "is not listed but may be categorized as International or Mexico" be cleaned up?

4. **Re-run the Script**: After adding the missing options to Airtable, run:
   ```bash
   npx tsx scripts/update-organizations-from-csv.ts --execute
   ```

## Script Location

Update script: `/Users/malcolmgarland/psychedelic-ecosystem-map/scripts/update-organizations-from-csv.ts`

To run preview mode:
```bash
npx tsx scripts/update-organizations-from-csv.ts
```

To execute updates:
```bash
npx tsx scripts/update-organizations-from-csv.ts --execute
```
