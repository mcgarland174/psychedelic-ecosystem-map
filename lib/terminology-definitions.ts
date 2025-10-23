/**
 * Comprehensive terminology definitions for the Psychedelic Ecosystem Map
 * Organized by priority level for user education
 */

export interface TermDefinition {
  term: string;
  shortDefinition: string;
  longDefinition?: string;
  examples?: string[];
  relatedTerms?: string[];
}

// ============================================================================
// PRIORITY LEVEL 1: Critical Core Concepts
// ============================================================================

export const CORE_CONCEPTS: Record<string, TermDefinition> = {
  'theory-of-change': {
    term: 'Theory of Change',
    shortDefinition: 'A framework that maps how different approaches and activities lead to desired changes in society.',
    longDefinition: 'A Theory of Change is a comprehensive roadmap that explains how and why desired change is expected to happen. It connects what we believe (worldviews) to what we want to achieve (outcomes) through concrete actions (projects), while identifying the problems that need to be solved along the way.',
    relatedTerms: ['Worldview', 'Outcome', 'Problem', 'Project']
  },

  'worldview': {
    term: 'Worldview',
    shortDefinition: 'A fundamental set of beliefs and values about how the world works and how change happens.',
    longDefinition: 'Worldviews are the underlying philosophies or perspectives that shape how people and organizations approach psychedelic work. Different worldviews lead to different priorities, strategies, and definitions of success in the psychedelic ecosystem.',
    examples: ['Medical/clinical perspective', 'Spiritual/traditional perspective', 'Social justice perspective', 'Research-driven perspective'],
    relatedTerms: ['Outcome', 'Theory of Change']
  },

  'outcome': {
    term: 'Outcome',
    shortDefinition: 'A specific, measurable change or result that the psychedelic ecosystem is working to achieve.',
    longDefinition: 'Outcomes are the desired societal, cultural, or systemic changes that the psychedelic ecosystem aims to create. They represent what success looks like - not just activities or outputs, but real transformations in how psychedelics are understood, accessed, and integrated into society.',
    examples: ['Increased access to psychedelic therapy', 'Reduced stigma around psychedelics', 'Evidence-based policy reform', 'Cultural integration of psychedelic wisdom'],
    relatedTerms: ['Worldview', 'Problem', 'Success Indicators']
  },

  'problem': {
    term: 'Problem',
    shortDefinition: 'A specific barrier, gap, or challenge that prevents desired outcomes from being achieved.',
    longDefinition: 'Problems are the obstacles standing in the way of achieving positive outcomes in the psychedelic ecosystem. Identifying and understanding these problems helps organizations focus their efforts and resources where they can make the most impact.',
    examples: ['Lack of trained therapists', 'Regulatory barriers to research', 'Limited public understanding', 'Unequal access to treatment'],
    relatedTerms: ['Outcome', 'Project', 'Problem Category']
  },

  'project': {
    term: 'Project',
    shortDefinition: 'A specific initiative, program, or effort undertaken to address problems and achieve outcomes.',
    longDefinition: 'Projects are the concrete actions being taken in the psychedelic ecosystem. They represent real work happening on the ground - research studies, advocacy campaigns, training programs, community initiatives, and more. Each project addresses one or more problems to help achieve desired outcomes.',
    examples: ['Clinical trial studying MDMA for PTSD', 'Therapist training certification program', 'Public education campaign', 'Policy advocacy initiative'],
    relatedTerms: ['Problem', 'Outcome', 'Organization']
  },

  'ecosystem-role': {
    term: 'Ecosystem Role',
    shortDefinition: 'The primary function or contribution an organization makes within the psychedelic ecosystem.',
    longDefinition: 'Ecosystem roles describe what an organization does and how it contributes to the overall psychedelic movement. Organizations can play one or multiple roles, and understanding these roles helps map how different parts of the ecosystem work together.',
    relatedTerms: ['Organization Type', 'Entity Type', 'Multi-Role Organizations']
  },

  'entity-type': {
    term: 'Entity Type',
    shortDefinition: 'The legal or structural classification of an organization.',
    longDefinition: 'Entity type describes how an organization is legally structured and operated. This affects its funding sources, tax status, governance, and how it can engage in different types of activities.',
    examples: ['501(c)(3) Nonprofit', 'For-profit corporation', 'Public benefit corporation', 'Academic institution', 'Government agency'],
    relatedTerms: ['Organization Type', 'Ecosystem Role']
  },

  'multi-role-organizations': {
    term: 'Multi-Role Organizations',
    shortDefinition: 'Organizations that serve multiple functions or play several roles within the ecosystem.',
    longDefinition: 'Multi-role organizations are particularly valuable because they bridge different areas of work. For example, a university might conduct research, provide training, and engage in policy advocacy. Organizations with 3+ roles often serve as important connectors and integrators in the ecosystem.',
    examples: ['A research center that also trains therapists and advocates for policy change', 'A nonprofit that provides clinical services while conducting research studies'],
    relatedTerms: ['Ecosystem Role', 'Organization']
  }
};

// ============================================================================
// PRIORITY LEVEL 2: Important Common Terms
// ============================================================================

export const ECOSYSTEM_ROLES: Record<string, TermDefinition> = {
  'academic-research': {
    term: 'Academic & Research',
    shortDefinition: 'Organizations conducting scientific studies and generating evidence about psychedelics.',
    longDefinition: 'These organizations advance our understanding of psychedelics through rigorous scientific research. They study safety, efficacy, mechanisms of action, and potential applications across mental health, neuroscience, and other fields.',
    examples: ['Universities with psychedelic research centers', 'Independent research institutes', 'Clinical trial sites']
  },

  'clinical-services': {
    term: 'Clinical Services',
    shortDefinition: 'Organizations providing psychedelic-assisted therapy or treatment to individuals.',
    longDefinition: 'Clinical service providers offer direct therapeutic interventions using psychedelics or psychedelic-assisted approaches. This includes ketamine clinics, psilocybin therapy trials, integration therapy, and preparation for psychedelic experiences.',
    examples: ['Ketamine therapy clinics', 'Clinical trial sites offering treatment', 'Integration therapists']
  },

  'funder': {
    term: 'Funder',
    shortDefinition: 'Organizations that provide financial resources to support psychedelic research, advocacy, or services.',
    longDefinition: 'Funders play a crucial role in enabling psychedelic work by providing grants, investments, or donations. They range from philanthropic foundations to impact investors to crowdfunding platforms.',
    examples: ['Philanthropic foundations', 'Impact investment funds', 'Donor-advised funds', 'Crowdfunding platforms']
  },

  'training-credentialing': {
    term: 'Training & Credentialing',
    shortDefinition: 'Organizations that educate and certify practitioners to work safely and effectively with psychedelics.',
    longDefinition: 'These organizations develop training programs, set professional standards, and credential practitioners. They ensure that therapists, facilitators, and other practitioners have the knowledge and skills needed to work responsibly with psychedelics.',
    examples: ['Psychedelic therapy training programs', 'Certification bodies', 'Professional education providers']
  },

  'community-peer-support': {
    term: 'Community & Peer Support',
    shortDefinition: 'Organizations fostering connection, mutual aid, and grassroots support among people interested in or impacted by psychedelics.',
    longDefinition: 'Community and peer support organizations create spaces for shared learning, healing, and connection outside of clinical or research settings. They often emphasize lived experience, mutual aid, and community wisdom.',
    examples: ['Integration circles', 'Peer support networks', 'Community education groups', 'Online forums and communities']
  },

  'advocacy': {
    term: 'Advocacy',
    shortDefinition: 'Organizations working to change laws, policies, and public opinion regarding psychedelics.',
    longDefinition: 'Advocacy organizations push for legal reform, policy change, and cultural acceptance of psychedelics. They engage in lobbying, public education, ballot initiatives, and strategic communications to shift the legal and social landscape.',
    examples: ['Drug policy reform organizations', 'Decriminalization campaigns', 'Medical legalization advocates']
  },

  'media': {
    term: 'Media',
    shortDefinition: 'Organizations creating content and communications to inform public understanding of psychedelics.',
    longDefinition: 'Media organizations produce journalism, documentaries, podcasts, books, and other content that shapes how psychedelics are understood and discussed publicly. They translate research, share stories, and influence cultural narratives.',
    examples: ['Psychedelic journalism outlets', 'Documentary filmmakers', 'Podcasters', 'Authors and publishers']
  },

  'government-policy': {
    term: 'Government & Policy',
    shortDefinition: 'Government agencies and officials involved in regulating, researching, or setting policy for psychedelics.',
    longDefinition: 'These are the governmental bodies that oversee psychedelic research, set regulatory frameworks, enforce drug laws, or develop public health policies. Their decisions directly shape what is legally and practically possible in the psychedelic space.',
    examples: ['FDA (drug approval)', 'DEA (scheduling)', 'State health departments', 'City councils (decriminalization)']
  },

  'spiritual-religious': {
    term: 'Spiritual / Religious',
    shortDefinition: 'Organizations approaching psychedelics through spiritual, religious, or ceremonial traditions.',
    longDefinition: 'These organizations honor and practice traditional or neo-traditional uses of psychedelics as sacraments or tools for spiritual development. They may represent indigenous traditions, established religions, or newer spiritual movements.',
    examples: ['Indigenous ayahuasca churches', 'Peyote ceremonial groups', 'Neo-shamanic organizations', 'Religious exemption groups']
  },

  'technology-data-systems': {
    term: 'Technology & Data Systems',
    shortDefinition: 'Organizations building digital tools, platforms, or databases to support the psychedelic ecosystem.',
    longDefinition: 'These organizations create technological infrastructure - from research databases and electronic health records to patient matching platforms and educational apps. They help the ecosystem function more efficiently and scale more effectively.',
    examples: ['Clinical trial management platforms', 'Patient-therapist matching services', 'Research databases', 'Telehealth platforms']
  },

  'industry-supply-chain': {
    term: 'Industry & Supply Chain',
    shortDefinition: 'Organizations involved in manufacturing, distributing, or commercializing psychedelic compounds and products.',
    longDefinition: 'The industry sector includes pharmaceutical companies developing psychedelic medicines, manufacturers producing compounds, and businesses building commercial psychedelic therapy models. They bring psychedelics to market and scale access.',
    examples: ['Pharmaceutical companies', 'GMP manufacturers', 'Therapy center chains', 'Supplement companies']
  },

  'cultural-indigenous': {
    term: 'Cultural & Indigenous',
    shortDefinition: 'Organizations preserving, protecting, and sharing indigenous and cultural wisdom related to psychedelics.',
    longDefinition: 'These organizations work to honor indigenous knowledge, protect traditional practices, ensure cultural equity, and prevent appropriation. They center the voices and rights of communities with long-standing psychedelic traditions.',
    examples: ['Indigenous rights organizations', 'Cultural preservation groups', 'Traditional medicine keepers', 'Reciprocity initiatives']
  }
};

export const PROBLEM_CATEGORIES: Record<string, TermDefinition> = {
  'research-evidence': {
    term: 'Research & Evidence',
    shortDefinition: 'Gaps in scientific knowledge and evidence about psychedelics.',
    longDefinition: 'This category includes problems related to insufficient research, lack of data, methodological limitations, and gaps in our scientific understanding of how psychedelics work, for whom they work, and under what conditions.',
    examples: ['Limited long-term safety data', 'Need for more diverse participant populations', 'Lack of research on specific conditions']
  },

  'policy-regulation': {
    term: 'Policy & Regulation',
    shortDefinition: 'Legal and regulatory barriers to psychedelic research, therapy, or access.',
    longDefinition: 'Problems in this category include restrictive drug scheduling, burdensome regulatory requirements, lack of clear pathways for legal access, and inconsistent policies across jurisdictions.',
    examples: ['Schedule I status limiting research', 'Lack of therapy practice frameworks', 'Patchwork of state laws']
  },

  'clinical-therapeutic': {
    term: 'Clinical & Therapeutic',
    shortDefinition: 'Challenges in delivering safe, effective psychedelic therapy.',
    longDefinition: 'This includes problems related to treatment protocols, clinical best practices, safety procedures, contraindications, and the practical delivery of psychedelic-assisted therapy.',
    examples: ['Lack of standardized protocols', 'Managing difficult experiences', 'Addressing adverse events']
  },

  'access-equity': {
    term: 'Access & Equity',
    shortDefinition: 'Barriers preventing fair and equal access to psychedelic therapies and benefits.',
    longDefinition: 'This category addresses disparities in who can access psychedelic therapy based on cost, geography, race, culture, disability, or other factors. It includes both immediate access barriers and longer-term equity concerns.',
    examples: ['High cost of treatment', 'Geographic limitations', 'Racial and cultural barriers', 'Lack of insurance coverage']
  },

  'safety-harm-reduction': {
    term: 'Safety & Harm Reduction',
    shortDefinition: 'Risks associated with psychedelic use and need for safety measures.',
    longDefinition: 'Problems related to potential harms from psychedelics - from individual adverse reactions to public health concerns. This includes both clinical safety and underground/unregulated use.',
    examples: ['Screening for contraindications', 'Managing psychological risks', 'Addressing underground market safety', 'Emergency response protocols']
  },

  'education-training': {
    term: 'Education & Training',
    shortDefinition: 'Need for educating practitioners, professionals, and the public about psychedelics.',
    longDefinition: 'This includes gaps in therapist training, professional education, public understanding, and the need for evidence-based educational resources across different audiences.',
    examples: ['Shortage of trained therapists', 'Lack of continuing education', 'Public misconceptions', 'Professional curriculum gaps']
  },

  'integration-support': {
    term: 'Integration & Support',
    shortDefinition: 'Challenges in helping people integrate psychedelic experiences into their lives.',
    longDefinition: 'Integration is the process of making meaning from and applying insights gained during psychedelic experiences. Problems include lack of integration support services, unclear best practices, and need for ongoing therapeutic support.',
    examples: ['Limited integration therapy availability', 'Lack of peer support infrastructure', 'Need for longer-term follow-up']
  },

  'infrastructure': {
    term: 'Infrastructure',
    shortDefinition: 'Lack of organizational systems, standards, and infrastructure to support the field.',
    longDefinition: 'This category includes gaps in professional standards, ethical frameworks, data systems, coordination mechanisms, and other foundational infrastructure needed for the ecosystem to function effectively and responsibly.',
    examples: ['Lack of professional standards', 'Need for ethical guidelines', 'Limited data sharing', 'Coordination challenges']
  },

  'cultural-social': {
    term: 'Cultural & Social',
    shortDefinition: 'Cultural barriers, social stigma, and need for cultural competency.',
    longDefinition: 'Problems related to social stigma, cultural appropriation, lack of cultural competency, and the need to honor diverse cultural approaches to psychedelics while ensuring respectful and equitable practices.',
    examples: ['Stigma and misinformation', 'Cultural appropriation concerns', 'Lack of culturally-adapted approaches', 'Indigenous rights and reciprocity']
  },

  'field-development-funding': {
    term: 'Field Development & Funding',
    shortDefinition: 'Challenges in building, sustaining, and funding the psychedelic ecosystem.',
    longDefinition: 'This includes problems related to insufficient funding, sustainability of organizations and initiatives, need for ecosystem coordination, and long-term field building challenges.',
    examples: ['Limited philanthropic funding', 'Unclear business models', 'Lack of coordination across organizations', 'Sustainability challenges']
  }
};

export const VIEW_TYPES: Record<string, TermDefinition> = {
  'grouped-view': {
    term: 'Grouped View',
    shortDefinition: 'Visual display showing items organized into categories or clusters.',
    longDefinition: 'The grouped view organizes organizations or projects into visual clusters based on a selected attribute (like ecosystem role or project type). Larger bubbles or bars represent categories with more items. This view helps you see the overall composition and relative size of different groups.',
    relatedTerms: ['Bubble Chart', 'Bar Chart']
  },

  'geographic-view': {
    term: 'Geographic View',
    shortDefinition: 'Visual display showing the geographic distribution of organizations or projects.',
    longDefinition: 'The geographic view maps where organizations and projects are located, helping you understand the spatial distribution of psychedelic ecosystem activity. This can reveal geographic concentrations, gaps, and regional patterns.',
    relatedTerms: ['Location', 'State/Province', 'Country']
  },

  'directory': {
    term: 'Directory',
    shortDefinition: 'A searchable list or table view of all organizations or projects.',
    longDefinition: 'The directory view presents information in a structured table format, making it easy to scan details, search for specific organizations or projects, and sort by different attributes. This is useful when you need to find something specific or compare details across items.',
    relatedTerms: ['Table View', 'Search', 'Filter']
  },

  'bubble-chart': {
    term: 'Bubble Chart',
    shortDefinition: 'A visualization where circles (bubbles) represent groups, with size indicating quantity.',
    longDefinition: 'In a bubble chart, each circle represents a category, and the size of the circle corresponds to how many items are in that category. Larger bubbles mean more organizations or projects. You can click bubbles to see the items within each category.',
    relatedTerms: ['Grouped View']
  },

  'bar-chart': {
    term: 'Bar Chart',
    shortDefinition: 'A visualization using horizontal bars to show quantities across different categories.',
    longDefinition: 'Bar charts display categories as horizontal bars, where the length of each bar represents the number of items in that category. This format makes it easy to compare quantities across categories and see rankings at a glance.',
    relatedTerms: ['Grouped View']
  },

  'composition-view': {
    term: 'Composition View',
    shortDefinition: 'Analysis showing how items are distributed across different categories.',
    longDefinition: 'Composition view breaks down the full set of organizations by different attributes - showing what percentage falls into each ecosystem role, entity type, or other classification. This helps you understand the makeup and diversity of the ecosystem.',
    relatedTerms: ['Grouped View', 'Ecosystem Role']
  }
};

// ============================================================================
// PRIORITY LEVEL 3: Technical Terms
// ============================================================================

export const TECHNICAL_TERMS: Record<string, TermDefinition> = {
  'filter-by': {
    term: 'Filter By',
    shortDefinition: 'Narrow down what you see by selecting specific criteria.',
    longDefinition: 'Filtering lets you focus on a subset of items that match specific criteria. For example, you can filter to see only organizations in a particular state, or only projects addressing a specific problem. Filters help you find exactly what you\'re looking for.',
    relatedTerms: ['Search', 'Group By']
  },

  'group-by': {
    term: 'Group By',
    shortDefinition: 'Choose which attribute to use for organizing items into categories.',
    longDefinition: 'Grouping determines how items are organized in the visualization. You can group by ecosystem role to see all advocacy organizations together, or group by location to see organizations by state. Changing the grouping shows different patterns in the data.',
    relatedTerms: ['Filter By', 'Grouped View']
  },

  'organization-type': {
    term: 'Organization Type',
    shortDefinition: 'The kind or category of organization.',
    longDefinition: 'Organization type provides additional classification beyond entity type - such as whether it\'s a university, research institute, clinic, foundation, etc. This helps distinguish between different organizational models even within the same entity type.',
    examples: ['University', 'Research Institute', 'Hospital/Clinic', 'Foundation', 'Professional Association'],
    relatedTerms: ['Entity Type', 'Ecosystem Role']
  },

  'status': {
    term: 'Status',
    shortDefinition: 'The current lifecycle stage of a project.',
    longDefinition: 'Project status indicates whether work is actively happening, planned for the future, completed, or paused. This helps you understand which projects are current opportunities for engagement or learning.',
    examples: ['Active', 'Planned', 'Completed', 'On Hold'],
    relatedTerms: ['Project']
  },

  'priority-area': {
    term: 'Priority Area',
    shortDefinition: 'The primary focus or theme of a project.',
    longDefinition: 'Priority area describes the main domain or focus of a project\'s work. This helps categorize projects by their primary intent and makes it easier to find projects working on similar themes.',
    relatedTerms: ['Type of Project', 'Problem Category']
  },

  'type-of-project': {
    term: 'Type of Project',
    shortDefinition: 'The category or approach that describes what kind of work the project does.',
    longDefinition: 'Project type classifies the nature of the work - such as research study, service delivery, advocacy campaign, training program, etc. Projects can have multiple types if they involve different kinds of activities.',
    examples: ['Clinical Trial', 'Policy Advocacy', 'Training Program', 'Community Education', 'Research Study'],
    relatedTerms: ['Priority Area', 'Project']
  },

  'success-indicators': {
    term: 'Success Indicators',
    shortDefinition: 'Measurable signs that an outcome is being achieved.',
    longDefinition: 'Success indicators are specific, observable evidence that progress is being made toward an outcome. They help track whether strategies are working and provide accountability for the impact we\'re trying to create.',
    examples: ['Number of trained therapists', 'States with legal access', 'Published research studies', 'People treated'],
    relatedTerms: ['Outcome', 'Expected Impact']
  },

  'expected-impact': {
    term: 'Expected Impact',
    shortDefinition: 'The anticipated change or results that a project aims to create.',
    longDefinition: 'Expected impact describes what a project hopes to achieve - the specific changes it expects to make in addressing problems or advancing outcomes. This goes beyond project activities to articulate the intended effect on the ecosystem.',
    relatedTerms: ['Outcome', 'Success Indicators', 'Project']
  },

  'affected-outcomes': {
    term: 'Affected Outcomes',
    shortDefinition: 'The outcomes that are hindered or prevented by a particular problem.',
    longDefinition: 'Each problem can affect one or more outcomes by creating barriers to their achievement. Understanding which outcomes are affected helps prioritize problems and design solutions that have the greatest leverage.',
    relatedTerms: ['Problem', 'Outcome']
  },

  'addressed-problems': {
    term: 'Addressed Problems',
    shortDefinition: 'The specific problems that a project is working to solve.',
    longDefinition: 'Projects tackle problems in order to achieve outcomes. Identifying which problems a project addresses helps map how different projects contribute to the ecosystem\'s goals and where there might be gaps or overlaps.',
    relatedTerms: ['Problem', 'Project', 'Outcome']
  }
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get definition by term key (case-insensitive, handles variations)
 */
export function getDefinition(term: string): TermDefinition | undefined {
  const normalizedTerm = term.toLowerCase().replace(/\s+/g, '-').replace(/[&/]/g, '-');

  return (
    CORE_CONCEPTS[normalizedTerm] ||
    ECOSYSTEM_ROLES[normalizedTerm] ||
    PROBLEM_CATEGORIES[normalizedTerm] ||
    VIEW_TYPES[normalizedTerm] ||
    TECHNICAL_TERMS[normalizedTerm]
  );
}

/**
 * Search for definitions by keyword
 */
export function searchDefinitions(keyword: string): TermDefinition[] {
  const lowerKeyword = keyword.toLowerCase();
  const allDefinitions = [
    ...Object.values(CORE_CONCEPTS),
    ...Object.values(ECOSYSTEM_ROLES),
    ...Object.values(PROBLEM_CATEGORIES),
    ...Object.values(VIEW_TYPES),
    ...Object.values(TECHNICAL_TERMS)
  ];

  return allDefinitions.filter(def =>
    def.term.toLowerCase().includes(lowerKeyword) ||
    def.shortDefinition.toLowerCase().includes(lowerKeyword) ||
    def.longDefinition?.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * Get all definitions organized by category
 */
export function getAllDefinitions() {
  return {
    'Core Concepts': CORE_CONCEPTS,
    'Ecosystem Roles': ECOSYSTEM_ROLES,
    'Problem Categories': PROBLEM_CATEGORIES,
    'View Types': VIEW_TYPES,
    'Technical Terms': TECHNICAL_TERMS
  };
}
