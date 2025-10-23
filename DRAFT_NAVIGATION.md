# Draft: Combined Navigation Header
## Psychedelic Ecosystem Map + Theory of Change

This document contains design drafts for combining the two tools into a unified navigation experience.

---

## Current State

### Ecosystem Map Navigation:
- Organizations tab (766 organizations)
- Projects tab (projects count)
- Each tab has: Grouped View | Geographic View | Directory

### Theory of Change Navigation:
- Worldviews section
- Outcomes section
- Problems section
- Projects section

---

## Draft Option 1: Top-Level Tool Switcher + Sub-Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│  Psychedelic Tools                                         [Submit]  │
├─────────────────────────────────────────────────────────────────────┤
│  [Ecosystem Map] [Theory of Change]                                 │
├─────────────────────────────────────────────────────────────────────┤
│  Organizations (766) | Projects (123)                               │
│  └─ Grouped View | Geographic View | Directory                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Pros:**
- Clear separation between tools
- Maintains current navigation within each tool
- Easy to understand

**Cons:**
- Three levels of navigation might be complex
- Requires switching between tools to access different data

---

## Draft Option 2: Unified Navigation by Content Type

```
┌─────────────────────────────────────────────────────────────────────┐
│  Psychedelic Ecosystem                                              │
├─────────────────────────────────────────────────────────────────────┤
│  Organizations | Projects | Worldviews | Outcomes | Problems        │
└─────────────────────────────────────────────────────────────────────┘
```

**Pros:**
- Single navigation layer
- All content accessible from one place
- Cleaner, more unified experience

**Cons:**
- Loses the conceptual grouping of "Theory of Change"
- May be too many tabs at top level

---

## Draft Option 3: Mega Menu / Dropdown Navigation

```
┌─────────────────────────────────────────────────────────────────────┐
│  Psychedelic Ecosystem Tools                           [Submit]     │
├─────────────────────────────────────────────────────────────────────┤
│  [Ecosystem ▼]  [Theory of Change ▼]  [About]                      │
│                                                                      │
│  When "Ecosystem ▼" clicked:                                        │
│  ┌──────────────────────┐                                          │
│  │ Organizations (766)   │                                          │
│  │ Projects (123)        │                                          │
│  │ Programs              │                                          │
│  └──────────────────────┘                                          │
│                                                                      │
│  When "Theory of Change ▼" clicked:                                │
│  ┌──────────────────────┐                                          │
│  │ Worldviews            │                                          │
│  │ Outcomes              │                                          │
│  │ Problems              │                                          │
│  │ Projects              │                                          │
│  └──────────────────────┘                                          │
└─────────────────────────────────────────────────────────────────────┘
```

**Pros:**
- Maintains conceptual grouping
- Scalable for future additions
- Professional, modern feel

**Cons:**
- Requires clicking to access sub-items
- Dropdown might hide content

---

## Draft Option 4: Side Navigation (Recommended)

```
┌──────────────┬──────────────────────────────────────────────────────┐
│              │  Psychedelic Ecosystem                               │
│ ECOSYSTEM    │  ─────────────────────────────────────────────────  │
│ Organizations│                                                      │
│ Projects     │  [Content for selected section]                     │
│ Programs     │                                                      │
│              │                                                      │
│ THEORY       │                                                      │
│ Worldviews   │                                                      │
│ Outcomes     │                                                      │
│ Problems     │                                                      │
│ ToC Projects │                                                      │
│              │                                                      │
│ ABOUT        │                                                      │
│ Overview     │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘
```

**Pros:**
- All sections visible at once
- Clear categorization with section headers
- Space for expansion
- Modern, app-like feel

**Cons:**
- Takes up horizontal space
- Different layout pattern from current design

---

## Draft Option 5: Tabbed Navigation with Grouped Sub-Tabs (My Recommendation)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  Psychedelic Ecosystem Tools                         │
│                                                           [Submit]   │
├─────────────────────────────────────────────────────────────────────┤
│  Ecosystem Map (766 orgs, 123 projects)  |  Theory of Change  | About│
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  WHEN "Ecosystem Map" SELECTED:                                     │
│  Organizations (766) | Projects (123)                               │
│  └─ Grouped View | Geographic View | Directory                      │
│                                                                      │
│  WHEN "Theory of Change" SELECTED:                                  │
│  Worldviews | Outcomes | Problems | Projects                        │
│  └─ [View options specific to each section]                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Pros:**
- Maintains current navigation patterns within each tool
- Only two top-level tabs (three with About)
- Sub-navigation appears contextually
- Familiar pattern for users
- Easy to implement with current architecture

**Cons:**
- Still two levels of navigation
- Can't see all content types at once

---

## Recommended Approach: Option 5

### Why Option 5?
1. **Minimal disruption** - Works with existing navigation structure
2. **Clear separation** - Users understand they're switching between tools
3. **Familiar** - Matches current tab-based navigation
4. **Scalable** - Easy to add more top-level tools later
5. **Mobile-friendly** - Tabs work well on smaller screens

### Implementation Plan:
1. Update hero to say "Psychedelic Ecosystem Tools"
2. Add top-level tabs: "Ecosystem Map" | "Theory of Change" | "About"
3. Keep existing sub-navigation within each tool
4. Add "Submit" button that changes based on active tool context
5. Use consistent warm earth tones branding across both tools

### Visual Mockup:

```jsx
<header>
  <h1>Psychedelic Ecosystem Tools</h1>
  <p>Explore organizations, projects, and our theory of change</p>

  {/* Top-level tool tabs */}
  <TabGroup>
    <Tab active={tool === 'ecosystem'}>
      Ecosystem Map <Badge>766 orgs</Badge>
    </Tab>
    <Tab active={tool === 'theory'}>
      Theory of Change
    </Tab>
    <Tab active={tool === 'about'}>
      About
    </Tab>
  </TabGroup>

  {/* Context-aware sub-navigation */}
  {tool === 'ecosystem' && (
    <SubTabGroup>
      <SubTab>Organizations (766)</SubTab>
      <SubTab>Projects (123)</SubTab>
      <SubTab>Programs</SubTab>
    </SubTabGroup>
  )}

  {tool === 'theory' && (
    <SubTabGroup>
      <SubTab>Worldviews</SubTab>
      <SubTab>Outcomes</SubTab>
      <SubTab>Problems</SubTab>
      <SubTab>Projects</SubTab>
    </SubTabGroup>
  )}
</header>
```

---

## Next Steps

1. Review draft options with stakeholders
2. Choose final navigation approach
3. Create component architecture plan
4. Design shared header component
5. Implement navigation with routing
6. Test navigation flows
7. Add tooltips for new sections

---

## Questions to Resolve

1. Should "Projects" appear in both tools, or should Theory of Change projects link to Ecosystem Map projects?
2. Do we need an "About" section explaining both tools?
3. Should the URL structure be `/ecosystem/organizations` and `/theory/worldviews`?
4. How should the Submit button work across both tools?
5. Should we add a search bar that works across both tools?

---

## Color Palette for Combined Navigation

Using the established warm earth tones:
- **Active tab**: `bg-teal-500` white text
- **Inactive tab**: transparent with `#2B180A` text, hover `bg-teal-50`
- **Borders**: `#E6C8A1`
- **Background**: `#FBF3E7`
- **Decorative bars**: `from-teal-600 to-teal-500` gradient
- **Submit buttons**: `bg-amber-500` with `hover:bg-amber-600`

