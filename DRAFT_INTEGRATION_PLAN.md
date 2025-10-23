# Integration Plan: Combining Ecosystem Map + Theory of Change

## Overview

This document outlines the plan to merge the Psychedelic Ecosystem Map and Theory of Change tools into a unified navigation experience while maintaining the distinct identity and functionality of each tool.

---

## Files Created

### 1. `/DRAFT_NAVIGATION.md`
Design document with 5 navigation options, pros/cons analysis, and recommendation for Option 5 (two-level tabbed navigation).

### 2. `/components/DRAFT_CombinedNavigation.tsx`
Standalone draft component showing the navigation pattern with:
- Top-level tool tabs (Ecosystem Map, Theory of Change, About)
- Context-aware section tabs
- Dynamic Submit buttons
- Warm earth tones branding

### 3. `/DRAFT_COMBINED_PAGE.tsx`
Complete page implementation demonstrating:
- Full integration of both tools
- State management for navigation
- All existing Ecosystem Map sections working
- Placeholder sections for Theory of Change content
- Modal dialogs maintained
- Context-aware submit buttons

---

## Implementation Phases

### Phase 1: Review & Approval ✅ (Current)
**Status:** Drafts completed, awaiting user review

**Deliverables:**
- [x] DRAFT_NAVIGATION.md
- [x] DRAFT_CombinedNavigation.tsx
- [x] DRAFT_COMBINED_PAGE.tsx
- [x] DRAFT_INTEGRATION_PLAN.md (this file)

**Next Steps:**
- User reviews draft files
- Approve navigation pattern and page structure
- Clarify any ambiguities (see "Questions to Resolve" below)

---

### Phase 2: Theory of Change Content Architecture
**Status:** Not started

**Tasks:**
1. **Define data models** for Theory of Change
   - Worldviews schema
   - Outcomes schema
   - Problems schema
   - ToC Projects schema (vs. Ecosystem projects)
   - Relationships between entities

2. **Create Airtable tables** or determine data sources
   - Set up Theory of Change base/tables
   - Define fields and relationships
   - Import/migrate any existing data

3. **Build API endpoints**
   - `/api/worldviews` - Fetch worldviews data
   - `/api/outcomes` - Fetch outcomes data
   - `/api/problems` - Fetch problems data
   - `/api/theory-projects` - Fetch ToC projects

4. **Create component structure**
   - `/components/theory/WorldviewsSection.tsx`
   - `/components/theory/OutcomesSection.tsx`
   - `/components/theory/ProblemsSection.tsx`
   - `/components/theory/TheoryProjectsSection.tsx`
   - Detail panels for each entity type

---

### Phase 3: Routing & URL Structure
**Status:** Not started

**Recommended URL Structure:**
```
/                          → Redirects to /ecosystem/organizations
/ecosystem/organizations   → Ecosystem Map - Organizations section
/ecosystem/projects        → Ecosystem Map - Projects section
/ecosystem/programs        → Ecosystem Map - Programs section
/theory/worldviews        → Theory of Change - Worldviews
/theory/outcomes          → Theory of Change - Outcomes
/theory/problems          → Theory of Change - Problems
/theory/projects          → Theory of Change - Projects
/about                    → About page
```

**Tasks:**
1. Update Next.js app structure to support routing
   - Migrate from single `/app/page.tsx` to route-based structure
   - Consider using Next.js App Router with nested layouts

2. Create shared layout component
   - Extract navigation header into shared layout
   - Maintain state across route changes

3. Implement URL-based navigation
   - Navigation tabs update URL
   - Browser back/forward buttons work correctly
   - Deep linking to specific sections

---

### Phase 4: Navigation Implementation
**Status:** Not started

**Tasks:**
1. **Replace current page.tsx** with combined version
   - Backup current `/app/page.tsx`
   - Test that all existing functionality still works

2. **Implement state persistence**
   - Remember user's last view choice (grouped/geographic/table)
   - Persist across navigation and page refreshes
   - Use localStorage or URL params

3. **Add loading states** for section transitions
   - Smooth transitions between tools
   - Skeleton loaders for content

4. **Mobile optimization**
   - Responsive navigation for smaller screens
   - Consider hamburger menu or vertical tabs
   - Test on mobile devices

---

### Phase 5: Theory of Change Visualizations
**Status:** Not started

**Tasks:**
1. **Design visualization approaches** for each section
   - Worldviews: How to display different perspectives?
   - Outcomes: Network diagram? Hierarchy?
   - Problems: Categorization? Relationships to outcomes?
   - Projects: How do they connect to problems/outcomes?

2. **Build visualization components**
   - Reuse patterns from Ecosystem Map where applicable
   - Consistent styling with warm earth tones
   - Interactive elements (hover, click, filter)

3. **Create relationship visualizations**
   - Show connections between worldviews, outcomes, problems, projects
   - Interactive graph or flow diagram
   - Filter by different dimensions

---

### Phase 6: Search & Cross-Tool Navigation
**Status:** Not started

**Optional Enhancement Tasks:**
1. **Global search** across both tools
   - Search organizations, projects, worldviews, outcomes, problems
   - Single search bar in header
   - Results grouped by entity type

2. **Cross-tool linking**
   - Link Ecosystem projects to ToC problems/outcomes
   - Show which organizations contribute to which outcomes
   - Bidirectional navigation between tools

3. **Unified filtering**
   - Filter across both tools simultaneously
   - Save and share filter combinations
   - Bookmark specific views

---

### Phase 7: Testing & Refinement
**Status:** Not started

**Tasks:**
1. **Functionality testing**
   - All navigation paths work correctly
   - Modals open/close properly
   - Data loads correctly
   - Submit forms work

2. **Accessibility testing**
   - Keyboard navigation
   - Screen reader compatibility
   - ARIA labels correct
   - Color contrast meets standards

3. **Performance testing**
   - Page load times
   - Transition smoothness
   - Data fetching optimization

4. **User testing**
   - Gather feedback on navigation clarity
   - Test with real users
   - Iterate based on feedback

---

### Phase 8: Deployment
**Status:** Not started

**Tasks:**
1. **Deploy to staging**
   - Test in production-like environment
   - Verify all integrations work

2. **Create migration plan**
   - Plan for transitioning existing users
   - Update any external links
   - Communicate changes

3. **Deploy to production**
   - Gradual rollout or feature flag
   - Monitor for errors
   - Have rollback plan ready

---

## Questions to Resolve

### 1. Projects Relationship
**Question:** Should "Projects" appear in both tools, or should Theory of Change projects link to Ecosystem Map projects?

**Options:**
- **A)** Separate projects lists - Ecosystem projects are different from ToC intervention projects
- **B)** Unified projects - Same project list, just categorized differently
- **C)** Ecosystem projects can be tagged with ToC problems/outcomes they address

**Recommendation:** Option C - Allows projects to exist in Ecosystem Map with additional metadata linking them to ToC framework.

### 2. Submit Button Behavior
**Question:** How should the Submit button work across both tools?

**Current Implementation:** Context-aware - changes based on active section
- Organizations section → "Submit Organization"
- Projects section → "Submit Project"
- Theory sections → Need to define

**Questions:**
- Should Theory of Change sections have submission forms?
- Who can submit worldviews, outcomes, problems?
- Is this admin-only or community-contributed?

### 3. About Section Content
**Question:** What should the About section contain?

**Suggested Content:**
- Description of both tools
- How to use the tools
- How to contribute
- About the organization/creators
- Methodology for mapping
- Data sources and verification
- Contact information

### 4. Programs Section
**Question:** What goes in the "Programs" section of Ecosystem Map?

**Needs Clarification:**
- What defines a "program" vs. a "project"?
- Is this data already in Airtable?
- What visualizations would be useful?
- How do programs relate to organizations?

### 5. Data Synchronization
**Question:** How will Theory of Change data be sourced and updated?

**Options:**
- **A)** New Airtable base/tables (recommended for consistency)
- **B)** Different data source (CMS, database, etc.)
- **C)** Hardcoded/manually updated

**Recommendation:** Option A - Keep all data in Airtable for unified management.

### 6. Verification for Theory of Change
**Question:** Should worldviews, outcomes, problems have verification status like organizations?

**Consideration:**
- Organizations have "verified" status
- Should ToC entities also have verification or approval status?
- Who verifies theoretical frameworks vs. organizations?

---

## Technical Decisions

### State Management
**Current:** React useState hooks in page component
**Future:** Consider if we need:
- URL state for deep linking
- localStorage for preferences
- Context API for global state
- Query params for filters

**Recommendation:** Start with URL state + localStorage, evaluate if more complex state management needed.

### Routing Strategy
**Options:**
1. **Single Page App** - All content in one page, JavaScript controls views
2. **Next.js App Router** - Separate routes with layouts
3. **Hybrid** - Main navigation as SPA, sections as routes

**Recommendation:** Option 2 (App Router) for better SEO, deep linking, and code organization.

### Animation Strategy
**Current:** CSS transitions and animations
**Keep:** Smooth, performant CSS animations
**Add:** Framer Motion if more complex transitions needed

---

## Migration Strategy

### Option A: Big Bang Migration
1. Build all Theory of Change components
2. Switch entire page to combined navigation at once
3. Deploy everything together

**Pros:**
- Simpler mental model
- Single transition for users
- No partial states

**Cons:**
- Higher risk
- Longer development time before release
- Hard to test in production

### Option B: Phased Migration (Recommended)
1. **Phase 1:** Deploy combined navigation with "Coming Soon" for Theory of Change
2. **Phase 2:** Add Worldviews section
3. **Phase 3:** Add Outcomes section
4. **Phase 4:** Add Problems section
5. **Phase 5:** Add Theory Projects section
6. **Phase 6:** Add cross-tool features

**Pros:**
- Lower risk
- Faster time to value
- Can gather feedback iteratively
- Easier to test

**Cons:**
- More deployment steps
- Temporary incomplete state

---

## File Structure Changes

### Current Structure
```
/app
  page.tsx           ← Single page with all content
/components
  SimpleBubbleView.tsx
  CompositionView.tsx
  GeographicCompositionView.tsx
  TableView.tsx
  ProjectsSection.tsx
  OrgDetailPanel.tsx
  ProjectDetailPanel.tsx
  TermTooltip.tsx
```

### Proposed Structure (Option 1: Flat)
```
/app
  layout.tsx         ← Shared layout with navigation
  ecosystem/
    organizations/
      page.tsx
    projects/
      page.tsx
    programs/
      page.tsx
  theory/
    worldviews/
      page.tsx
    outcomes/
      page.tsx
    problems/
      page.tsx
    projects/
      page.tsx
  about/
    page.tsx
/components
  navigation/
    CombinedNavigation.tsx
  ecosystem/         ← Existing components
    SimpleBubbleView.tsx
    CompositionView.tsx
    GeographicCompositionView.tsx
    TableView.tsx
    ProjectsSection.tsx
  theory/            ← New components
    WorldviewsSection.tsx
    OutcomesSection.tsx
    ProblemsSection.tsx
    TheoryProjectsSection.tsx
    WorldviewDetailPanel.tsx
    OutcomeDetailPanel.tsx
    ProblemDetailPanel.tsx
  shared/
    OrgDetailPanel.tsx
    ProjectDetailPanel.tsx
    TermTooltip.tsx
```

### Proposed Structure (Option 2: Feature-based)
```
/app
  layout.tsx
  page.tsx           ← Redirect to /ecosystem/organizations
/features
  ecosystem/
    components/
      SimpleBubbleView.tsx
      CompositionView.tsx
      GeographicCompositionView.tsx
      TableView.tsx
      ProjectsSection.tsx
    routes/
      organizations/
        page.tsx
      projects/
        page.tsx
      programs/
        page.tsx
  theory/
    components/
      WorldviewsSection.tsx
      OutcomesSection.tsx
      ProblemsSection.tsx
      TheoryProjectsSection.tsx
    routes/
      worldviews/
        page.tsx
      outcomes/
        page.tsx
      problems/
        page.tsx
      projects/
        page.tsx
/components
  shared/
    Navigation.tsx
    DetailPanel.tsx
    TermTooltip.tsx
```

**Recommendation:** Option 1 (Flat structure) - Simpler, follows Next.js conventions, easier to navigate.

---

## Design Consistency Checklist

All new components should follow these patterns:

### Colors (Warm Earth Tones)
- [x] Primary teal: `#317E6D`, `#1F5F51`, `#9DCDC3`, `#133931`
- [x] Accent gold/amber: `#CC8D37`, `#EFB566`, `#F4CE99`
- [x] Neutrals: `#FBF3E7`, `#F7F0E8`, `#E6C8A1`
- [x] Text: `#2B180A`, `#4A4643`, `#6B6764`

### Visual Elements
- [x] Decorative bar: `from-teal-600 to-teal-500` gradient
- [x] Borders: `#E6C8A1` with 2px thickness
- [x] Rounded corners: `rounded-xl` (12px) or `rounded-2xl` (16px)
- [x] Shadows: Teal-tinted shadows `rgba(49, 126, 109, 0.1)`

### Interactive Elements
- [x] Submit buttons: `bg-amber-500 hover:bg-amber-600`
- [x] Active tabs: `bg-teal-500 text-white`
- [x] Inactive tabs: `hover:bg-teal-50 text-[#2B180A]`
- [x] Hover effects: `hover:scale-105` with `transition-all`

### Typography
- [x] Headers: Font-bold with `#2B180A` color
- [x] Body text: Font-normal with `#4A4643` color
- [x] Line height: `leading-relaxed` (1.6)
- [x] No emojis unless requested

### Tooltips
- [x] Click-only (no hover)
- [x] Use sparingly - only for technical terms
- [x] Consistent positioning and styling

---

## Success Metrics

How will we know the integration is successful?

### User Engagement
- [ ] Time spent exploring both tools increases
- [ ] Cross-navigation between tools occurs frequently
- [ ] Bounce rate decreases
- [ ] Return visitor rate increases

### Functionality
- [ ] All existing Ecosystem Map features work
- [ ] Navigation is intuitive (measured by user testing)
- [ ] Load times remain under 2 seconds
- [ ] No accessibility regressions

### Data Quality
- [ ] Submit forms continue to work
- [ ] Verification system maintained
- [ ] Data accuracy preserved
- [ ] New submissions increase

---

## Timeline Estimate

**Assuming 1 developer working part-time:**

| Phase | Tasks | Estimated Time | Dependencies |
|-------|-------|----------------|--------------|
| Phase 1: Review | Review drafts, clarify questions | 1-2 days | None |
| Phase 2: ToC Architecture | Data models, Airtable setup, APIs | 1 week | Phase 1 complete, data decisions made |
| Phase 3: Routing | Next.js routing, URL structure | 3-4 days | Phase 1 complete |
| Phase 4: Navigation | Implement combined nav, state mgmt | 3-4 days | Phase 3 complete |
| Phase 5: ToC Visualizations | Build 4 ToC sections + components | 2-3 weeks | Phase 2 complete |
| Phase 6: Cross-tool Features | Search, linking (optional) | 1 week | Phases 4 & 5 complete |
| Phase 7: Testing | All testing types | 1 week | Phase 5 complete |
| Phase 8: Deployment | Staging, production deploy | 2-3 days | Phase 7 complete |

**Total Estimated Time:** 6-8 weeks for full integration

**Phased Deployment Timeline:**
- Week 1-2: Navigation shell with placeholders (user can see structure)
- Week 3-4: First ToC section (Worldviews)
- Week 5-6: Second ToC section (Outcomes)
- Week 7-8: Final sections (Problems, Projects)
- Week 9+: Cross-tool features and enhancements

---

## Risk Assessment

### High Risk
- **Data modeling uncertainty** - If ToC data structure isn't clear, could cause rework
  - *Mitigation:* Resolve data questions in Phase 1

- **Routing complexity** - Next.js routing might require significant refactoring
  - *Mitigation:* Prototype routing early in Phase 3

### Medium Risk
- **Performance impact** - More content could slow page loads
  - *Mitigation:* Code splitting, lazy loading, performance testing

- **User confusion** - Combined navigation might be unclear
  - *Mitigation:* User testing, clear labels, optional onboarding

### Low Risk
- **Design consistency** - New components might not match style
  - *Mitigation:* Design checklist, component library

- **Accessibility regressions** - New navigation could break a11y
  - *Mitigation:* A11y testing checklist, automated tests

---

## Next Steps (Immediate)

1. **User reviews this integration plan** ← YOU ARE HERE
2. **Answer "Questions to Resolve"** (see section above)
3. **Approve navigation pattern** from DRAFT_NAVIGATION.md
4. **Review DRAFT_COMBINED_PAGE.tsx** functionality
5. **Make decision on migration strategy** (Big Bang vs. Phased)
6. **Define Theory of Change data models**
7. **Proceed to Phase 2 or Phase 3** based on priorities

---

## Resources & References

- **Draft Files:**
  - `/DRAFT_NAVIGATION.md` - Navigation options & recommendation
  - `/components/DRAFT_CombinedNavigation.tsx` - Navigation component
  - `/DRAFT_COMBINED_PAGE.tsx` - Full page implementation

- **Current Implementation:**
  - `/app/page.tsx` - Existing Ecosystem Map page
  - `/lib/airtable.ts` - Data fetching logic

- **Design System:**
  - Warm earth tones palette (see "Design Consistency Checklist")
  - Click-only tooltips for technical terms
  - Verification badges for validated organizations

---

**Document Version:** 1.0
**Last Updated:** 2025-10-23
**Status:** Awaiting user review and approval
