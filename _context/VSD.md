# App Busqueda Empleo - Vision and Scope Document

## Title

| Field | Value |
| --- | --- |
| Document | Vision and Scope Document |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - for review |
| Author | Consultor |
| Reviewers | Aelium |
| Organization | Aelium |
| Repository Type | Software Product |
| Last Updated | 2026-09-11 |

## 1. Vision

App Busqueda Empleo will help a job seeker find software developer vacancies that match a focused personal search profile without manually checking several portals every day. The product will collect, normalize, filter, store, notify, and summarize job offers from the main portals relevant to the search.

The long-term vision is a personal employment assistant that first recommends matching offers and later supports assisted or automatic application workflows with traceable data about where offers originate and where applications are submitted.

## 2. Problem Statement

Searching for junior software developer roles in a specific location is repetitive and noisy. Job portals often include offers that do not match the candidate's target profile, seniority, work modality, or city. LinkedIn can also redirect the candidate to external application portals, making it harder to understand which sites are actually used for applying.

The system must reduce that noise by collecting offers from LinkedIn, InfoJobs, and Tecnoempleo; filtering them against the user's requirements; storing relevant offer information; and notifying the user through WhatsApp when matching offers are found.

## 3. Business Opportunity

The first business value is personal productivity: the candidate receives a smaller, higher-quality set of job opportunities and can react faster to suitable openings. The second value is analytical: stored offer data can reveal which portals and company sites are most frequently used for applications, supporting future automation decisions.

In the future, the same data foundation can support automatic or semi-automatic job applications, application tracking, and recommendation quality improvements.

## 4. Stakeholders

| Stakeholder | Role | Interest |
| --- | --- | --- |
| Job seeker | Primary user | Receive relevant software developer job offers in Zaragoza without manually searching every portal. |
| Aelium | Product owner / maintainer | Build and maintain a reliable personal job search assistant with traceable quality documentation. |
| Job portals | External data sources | Publish job offers and, in some cases, redirect applications to external websites. |
| Employers / hiring companies | Offer publishers | Receive applications from candidates who match the vacancy profile. |
| WhatsApp messaging provider | Notification channel | Deliver filtered job alerts to the user's personal phone. |

## 5. Product Scope

The product will collect job offers from LinkedIn, InfoJobs, and Tecnoempleo, focusing on roles that match the following search profile:

- Junior or approximately 2 to 3 years of experience maximum.
- Software developer role.
- On-site work modality.
- Located in Zaragoza.

The system will store at least the following offer data:

- Company name.
- Job description.
- Portal where the job offer was found.
- Application destination when the original portal redirects to another site, especially for LinkedIn offers.

The system will include a backend API that reads stored offer data and produces statistics about the most common application portals, including generic job portals and company-specific career pages. A frontend interface will consume that API and display the statistical view.

The system will send WhatsApp notifications to the user's personal phone with offers that pass the configured filters.

Out of scope for the initial version:

- Automatic application submission.
- CV or cover letter generation.
- Multi-user account management.
- Paid job-advertising workflows for companies.
- Guaranteeing access to external portals where technical, legal, or terms-of-service restrictions prevent collection.

## 6. Objectives

| ID | Objective | Success Metric | Target |
| --- | --- | --- | --- |
| OBJ-001 | Collect job offers from LinkedIn, InfoJobs, and Tecnoempleo for the configured search profile. | Number of configured portals with successful collection runs. | 3 target portals supported in the initial release, subject to access constraints. |
| OBJ-002 | Filter collected offers against seniority, role, work modality, and location requirements. | Percentage of notified offers that match all configured filters after review. | At least 90% of notified offers match the target profile. |
| OBJ-003 | Preserve job offer data needed for review and future automation. | Required offer fields stored for each accepted offer. | Company name, job description, source portal, and application destination stored for every accepted offer. |
| OBJ-004 | Notify the user through WhatsApp when suitable offers are found. | Time between offer collection and WhatsApp notification. | Matching offers are sent within 15 minutes of a successful collection cycle. |
| OBJ-005 | Provide backend statistics about application portal usage. | API availability for portal usage aggregation. | Backend exposes aggregated counts by source portal and application destination. |
| OBJ-006 | Provide a frontend view for statistical analysis of stored offers. | Frontend can display backend aggregation without manual database access. | User can view portal usage statistics from the graphical interface. |

## 7. Constraints

- External portal access must respect each portal's available APIs, permissions, robots guidance, rate limits, and terms of service.
- The first supported portals are LinkedIn, InfoJobs, and Tecnoempleo.
- The initial target search is personal and location-specific: Zaragoza, on-site, software developer, junior or 2 to 3 years of experience maximum.
- WhatsApp notifications require an approved messaging mechanism, such as WhatsApp Business Platform or another compliant provider.
- Personal data, phone numbers, job descriptions, and application links must be handled with appropriate security and privacy controls.
- Backend, database, frontend, collection jobs, and notification workflows must remain traceable to requirements and tests under the Aelium Qualitas documentation model.

## References

- ISO/IEC/IEEE 29148 Requirements Engineering
- Rational Unified Process Vision Document
- Aelium Organizational Test Policy
- Aelium Organizational Test Strategy
