# Airtable Dropdown Options to Add

## State / Province Field

### ✅ International Locations (Recommended to Add)
- Colombia
- England
- France
- Germany
- International
- Mexico
- Netherlands
- Peru
- Portugal
- Slovenia
- Switzerland
- United Kingdom

### ✅ US States (Recommended to Add)
- Alabama
- California
- Florida
- Hawaii
- Illinois
- Michigan
- Minnesota
- Utah
- Virginia
- Washington

### ✅ Canadian/Australian (Recommended to Add)
- Halifax
- Queensland
- Toronto

### ⚠️ Special/Other Values (Consider Adding)
- Global
- International
- None
- Other
- Puerto Rico

### ❌ Data Quality Issues (Fix in CSV Instead)
- "None of the above" → Should be cleaned up or use "Global" or leave empty
- "suggest a category" → Clean up in CSV
- "There is inadequate data" → Leave empty in CSV
- "is not listed but may be categorized as International or Mexico" → Choose one
- "CA" → Change to "California"
- "NY" → Change to "New York"
- "Lincoln" → This is a city, not a state (fix in CSV)
- "London" → This is a city, not a state (fix in CSV)
- "San José Province" → This is in Costa Rica, consider "Costa Rica" or "International"

---

## Population Served Field

### ✅ Recommended to Add
- Adults
- Out-of-state visitors (healing tourism)
- People who use drugs

---

## Substance of Focus Field

### ✅ Recommended to Add
- Sassafras / MDA

---

## Area of Focus Field

### ✅ Recommended to Add
- Multiple substances / Public health policy
- Psychedelics (General)

---

## Entity Type Field

### ❌ Data Quality Issues (Fix in CSV Instead)
- "for profit" → Change to "For profit" (capitalization)
- "For profit, Nonprofit" → Choose one or create a new option "Hybrid"
- "Healing Center" → This belongs in "Organization Type", not "Entity Type"

---

## Ecosystem Role Field

### ❌ Data Quality Issues (Fix in CSV Instead)
- "FUnders" → Change to "Funder" (typo)
- "Advocacy Industry & Supply Chain" → Should this be two separate values? Or combine existing ones?

---

## Organization Type Field

### ⚠️ Consider Adding
- "Healing Center" (currently showing as Entity Type in some records)

---

## Status Field

### ❌ Data Quality Issues (Fix in CSV Instead)
- "Acyive" → Change to "Active" (typo)

---

## Summary of Actions

### Action 1: Add These Options to Airtable

Copy and paste these lists into Airtable's field configuration:

**State / Province** (add these 27 options):
```
Alabama
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
Switzerland
Toronto
United Kingdom
Utah
Virginia
Washington
```

**Population Served** (add these 3 options):
```
Adults
Out-of-state visitors (healing tourism)
People who use drugs
```

**Substance of Focus** (add 1 option):
```
Sassafras / MDA
```

**Area of Focus** (add these 2 options):
```
Multiple substances / Public health policy
Psychedelics (General)
```

### Action 2: Fix These Data Issues in CSV

Before re-running the script, fix these in the CSV file:

| Organization | Field | Current Value | Should Be |
|-------------|-------|---------------|-----------|
| Guru | Entity Type | "for profit" | "For profit" |
| PSYLOCYBIN HEALING CENTERS OF COLORADO INC | Status | "Acyive" | "Active" |
| Luke Nosek & Nicole Nosek | Ecosystem Role | "FUnders" | "Funder" |
| Evolve Ventures and Foundation | State | "CA" | "California" |
| Sabba Collective (PBC) | State | "NY" | "New York" |
| Bunk Police | State | "Lincoln" | Choose appropriate state or "Nebraska" |
| Psyaware | State | "London" | "United Kingdom" or "England" |
| The Plant Medicine People | State | "San José Province" | "Costa Rica" or "International" |
| Drugs Forum | State | "suggest a category" | Choose appropriate value or leave empty |
| EPIC | State | "There is inadequate data" | Leave empty or choose appropriate value |
| Tandava Retreats | State | "is not listed..." | "Mexico" or "International" |
| Salvum.love | State | "None of the above" | "Global" or "International" |
| Experiential Training Institute | State | "None" | Leave empty or choose appropriate value |

### Action 3: Decide on These Cases

**First Light Group, Inc**
- Current: Entity Type = "For profit, Nonprofit"
- Options:
  - Choose one: "For profit" OR "Nonprofit"
  - Add new option: "Hybrid" or "Social Enterprise"

**SANGAM HEALING CENTER LLC**
- Current: Organization Type = "Healing Center"
- Options:
  - Add "Healing Center" to Organization Type dropdown
  - OR change to existing type like "Retreat Center" or "Clinic"

**Association for Prescription Psychedelics**
- Current: Ecosystem Role = "Advocacy Industry & Supply Chain"
- Options:
  - Choose one existing role: "Advocacy" OR "Industry & Supply Chain"
  - OR add this combined option

---

## Quick Copy-Paste for Airtable

### For "State / Province" field:
```
Alabama, California, Colombia, England, Florida, France, Germany, Global, Halifax, Hawaii, Illinois, International, Mexico, Michigan, Minnesota, Netherlands, Other, Peru, Portugal, Puerto Rico, Queensland, Slovenia, Switzerland, Toronto, United Kingdom, Utah, Virginia, Washington
```

### For "Population Served" field:
```
Adults, Out-of-state visitors (healing tourism), People who use drugs
```

### For "Substance of Focus" field:
```
Sassafras / MDA
```

### For "Area of Focus" field:
```
Multiple substances / Public health policy, Psychedelics (General)
```
