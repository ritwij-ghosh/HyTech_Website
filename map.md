# HyTech Racing Website Map

Source: https://hytechracing.gatech.edu/
Reviewed: October 8, 2026

Use this map to implement the existing website's information architecture. Each page summary contains 10 words. Indented branches represent sections or content within a page, not additional routes, unless explicitly marked as external links.

## Page and content tree

```text
HyTech Racing
├── Home — /
│   Summary: Introduces Georgia Tech’s electric racing team, mission, and student opportunities.
│   ├── Georgia Tech’s Formula SAE Electric Team
│   │   ├── Introduction to the student organization and electric vehicle program
│   │   └── Team and vehicle photo gallery
│   ├── To Race is Not Enough
│   │   └── Educational mission: research, design, manufacturing, management, and testing
│   └── Get involved
│       ├── Contact Our Team — email link
│       └── Interested in joining? — external Linktree link
│
├── Sponsors — /sponsors/
│   Summary: Recognizes team sponsors by contribution tier and invites sponsorship inquiries.
│   ├── Sponsorship inquiry
│   │   └── Email the team to request its sponsor packet
│   └── Sponsor recognition, grouped by tier
│       ├── Champion
│       ├── Podium
│       ├── Trackside
│       └── Paddock — includes family acknowledgments
│
├── Team — /team/
│   Summary: Presents current leadership, subteam leads, faculty advisor, and historical rosters.
│   ├── Team photo and competition caption
│   ├── Current Roster
│   │   ├── Team Leadership — portraits, names, and roles
│   │   ├── Subteam Leads — portraits, names, and engineering responsibilities
│   │   ├── Faculty Advisor — name and academic discipline
│   │   └── Team Members — member names
│   └── Archived rosters — annual tabs
│       ├── 2024–2025 through 2012–2013, inclusive
│       └── Show each year's available leadership, leads, advisors, and members
│
├── Cars — /cars/
│   Summary: Documents electric racecars through engineering summaries, specifications, photographs, and results.
│   ├── 2025 — HT09
│   │   ├── Vehicle photo and caption
│   │   ├── Engineering Summary — major design changes and rationale
│   │   ├── Results — competition performance and placements
│   │   ├── HT09 Vehicle Details
│   │   │   └── Mass, dimensions, performance, suspension, powertrain, accumulator,
│   │   │       aerodynamics, sensors, battery monitoring, and gearbox
│   │   └── Photo gallery
│   └── Past Cars — sections within the same page
│       ├── 2024 / HT08, 2023 / HT07, 2022 / HT06, 2021 / HT05, 2019 / HT04
│       │   └── Engineering summaries, results, vehicle specifications, and photos
│       ├── 2018 / HT03B — competition highlights, specifications, and photos
│       ├── 2017 — vehicle redesign and competition highlights
│       ├── 2016
│       │   ├── Competition overview
│       │   ├── Chassis Details
│       │   ├── Driveline Details
│       │   ├── Mechanical Controls Details
│       │   ├── Suspension Details
│       │   ├── Electrical Controls Details
│       │   └── High Voltage System Details
│       ├── 2015 — Vehicle Overview, CAD Design, Electrical Overview
│       └── 2013 — external historical team archive link
│
├── Donate — /donate/
│   Summary: Explains donation options, employer matching, corporate support, and sponsorship tiers.
│   ├── Donate to HyTech!
│   │   └── Explain how contributions support the team and engineering education
│   ├── Would your company like to support us?
│   │   └── Team email and internal link to sponsorship opportunities
│   ├── How to Donate
│   │   ├── Employer matching gift reminder
│   │   ├── Option 1 — external Georgia Tech Foundation donation link
│   │   │   └── Instructions for designating a gift to HyTech Racing
│   │   └── Option 2 — external Square payment link
│   │       └── Credit/debit card donations; retain existing tax treatment wording
│   └── Sponsor Tiers
│       ├── Sponsorship benefits graphic
│       └── Title sponsorship eligibility and vehicle naming note
│
└── Contact — /contact/
    Summary: Provides team contact information, shop location, transportation, and meeting access.
    ├── HyTech Racing
    │   ├── Address: 575 14th St NW, Atlanta, GA 30318
    │   ├── Phone: (850) 888-3232
    │   └── Email: gthytech@gmail.com
    ├── Meeting participation — email inquiries and ride requests
    └── Shop access
        ├── Walking, driving, MARTA, and GT Stinger Green Route information
        └── Embedded Google Map
```

## Shared layout

- **Header navigation, in order:** Sponsors, Team, Cars, Donate, Contact.
- **Home access:** Make the site logo or brand name link to `/`.
- **Footer:** Copyright, team email, Facebook link, and Instagram link.
- **Email links:** Use `mailto:gthytech@gmail.com`.
- **Phone link:** Use `tel:+18508883232`.

## Implementation guidance

- Implement six page routes; roster years and car years belong within their respective pages.
- Preserve the listed section order and hierarchy. Descriptive tree labels need not become literal visible headings.
- Build shared header/footer components and reusable roster, sponsor-tier, and vehicle-detail components.
- Store rosters, sponsors, and cars as structured data to simplify annual updates.
- Support the Team page's current/historical roster tabs and the Cars page's `2025` / `Past Cars` navigation.
- Historical car entries have different levels of detail. Render only the sections available for each year.
- Retrieve exact copy, images, sponsor logos, external URLs, and the sponsorship graphic from the source pages. This map summarizes content and is not a complete asset inventory.
- Preserve donation instructions, sponsorship conditions, and tax treatment wording from the source; do not invent payment flows.
- Use semantic headings, accessible navigation and tabs, descriptive image alt text, and responsive layouts.
- The year labels above reflect the reviewed site. Do not invent newer cars or rosters.

## Source pages

- [Home](https://hytechracing.gatech.edu/)
- [Sponsors](https://hytechracing.gatech.edu/sponsors/)
- [Team](https://hytechracing.gatech.edu/team/)
- [Cars](https://hytechracing.gatech.edu/cars/)
- [Donate](https://hytechracing.gatech.edu/donate/)
- [Contact](https://hytechracing.gatech.edu/contact/)
