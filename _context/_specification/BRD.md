# App Busqueda Empleo - Business Requirements Document

## Title

| Field | Value |
| --- | --- |
| Document | Business Requirements Document |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - for review |
| Author | Consultor |
| Reviewers | Aelium |
| Organization | Aelium |
| Last Updated | 2026-09-11 |

## 1. Introduction

### 1.1 Purpose

This document defines the business requirements for App Busqueda Empleo. The initiative exists to reduce the effort and noise involved in searching for junior software developer jobs in Zaragoza across LinkedIn, InfoJobs, and Tecnoempleo.

The product must support a personal job search workflow: collect relevant offers, filter them against the user's profile, store the data needed for review and future automation, notify the user through WhatsApp, and expose statistics about source and application portals through a backend API and frontend interface.

### 1.2 Scope

In scope:

- Collection of job offers from LinkedIn, InfoJobs, and Tecnoempleo, subject to each portal's access constraints.
- Filtering offers for junior or approximately 2 to 3 years of experience maximum, software developer role, on-site work modality, and Zaragoza location.
- Storage of accepted offer information, including company name, job description, source portal, and application destination.
- WhatsApp notification to the user's personal phone for offers that pass the configured filters.
- Backend API for retrieving stored data and aggregated portal statistics.
- Frontend interface for viewing statistical data about offer sources and application destinations.

Out of scope for the initial version:

- Automatic application submission.
- CV or cover letter generation.
- Multi-user account management.
- Employer-facing job posting features.
- Circumventing portal restrictions, authentication limits, robots guidance, or terms of service.

### 1.3 Definitions

| Term | Definition |
| --- | --- |
| Job offer | A vacancy or employment opportunity collected from a supported job portal or reachable application destination. |
| Source portal | The portal where the job offer was first discovered by the system, such as LinkedIn, InfoJobs, or Tecnoempleo. |
| Application destination | The website or portal where the candidate is ultimately sent to apply for the job. |
| Accepted offer | A collected offer that passes the configured filters and is stored for notification or analysis. |
| Search profile | The configured criteria used to select suitable offers: junior or up to approximately 2 to 3 years of experience, software developer, on-site, Zaragoza. |
| WhatsApp notification | A message sent to the user's personal phone through an approved WhatsApp-compatible messaging provider. |

## 2. Business Objectives

| Objective | Description |
| --- | --- |
| OBJ-001 | Collect job offers from LinkedIn, InfoJobs, and Tecnoempleo for the configured search profile. |
| OBJ-002 | Filter collected offers against seniority, role, work modality, and location requirements. |
| OBJ-003 | Preserve job offer data needed for review and future automation. |
| OBJ-004 | Notify the user through WhatsApp when suitable offers are found. |
| OBJ-005 | Provide backend statistics about application portal usage. |
| OBJ-006 | Provide a frontend view for statistical analysis of stored offers. |

## 3. Stakeholders

| Stakeholder | Role | Interest |
| --- | --- | --- |
| Job seeker | Primary user | Receive a focused set of relevant software developer job offers in Zaragoza. |
| Aelium | Product owner / maintainer | Build a maintainable job search assistant with reliable data and traceable requirements. |
| Job portals | External data sources | Publish offers and define permitted access methods and restrictions. |
| Employers / hiring companies | Offer publishers | Receive applications from candidates who match the vacancy profile. |
| WhatsApp messaging provider | Notification channel | Deliver compliant messages to the user's personal phone. |

## 4. Business Requirements

Each requirement traces up to an Objective (`VSD.md`) and is elaborated downstream by one or more `FR-xxx` / `NFR-xxx` (`FRD-template.md` / `NFRD-template.md`). A requirement is never a task; it must remain valid even if the implementation that satisfies it changes.

| ID | Requirement | Priority | Traces to (OBJ-xxx) |
| --- | --- | --- | --- |
| REQ-001 | The product shall collect job offers from LinkedIn, InfoJobs, and Tecnoempleo as the initial supported portals. | Must | OBJ-001 |
| REQ-002 | The product shall support a configurable search profile for junior or approximately 2 to 3 years of experience maximum, software developer role, on-site modality, and Zaragoza location. | Must | OBJ-002 |
| REQ-003 | The product shall exclude or mark as non-matching offers that do not satisfy the configured search profile. | Must | OBJ-002 |
| REQ-004 | The product shall store accepted offer data needed for later review and automation. | Must | OBJ-003 |
| REQ-005 | The stored data for each accepted offer shall include company name, job description, source portal, and application destination when available. | Must | OBJ-003 |
| REQ-006 | The product shall detect and retain the application destination when an offer redirects from the source portal to another portal or company website. | Should | OBJ-003, OBJ-005 |
| REQ-007 | The product shall notify the user through WhatsApp when new accepted offers are available. | Must | OBJ-004 |
| REQ-008 | WhatsApp notifications shall contain enough offer information for the user to decide whether to inspect the vacancy. | Should | OBJ-004 |
| REQ-009 | The backend shall expose stored offer data through an API for internal frontend consumption. | Must | OBJ-005, OBJ-006 |
| REQ-010 | The backend shall provide aggregated statistics showing how often each source portal and application destination appears in stored offers. | Must | OBJ-005 |
| REQ-011 | The frontend shall display statistical views based on backend API data without requiring direct database access. | Must | OBJ-006 |
| REQ-012 | The product shall preserve a data foundation suitable for future automatic or semi-automatic job application workflows. | Should | OBJ-003, OBJ-005, OBJ-006 |

## 5. Business Constraints

Externally imposed limits the solution must respect, rather than requirements the team chooses.

| ID | Constraint | Rationale |
| --- | --- | --- |
| CON-001 | External portal collection must respect each portal's APIs, permissions, robots guidance, rate limits, and terms of service. | Access to job data depends on legal and technical constraints controlled by third-party portals. |
| CON-002 | WhatsApp delivery must use an approved and compliant messaging mechanism. | Personal phone notifications depend on WhatsApp platform rules and provider capabilities. |
| CON-003 | The system must protect personal data, phone numbers, job descriptions, application links, and any stored job-search metadata. | The product stores and transmits data that can reveal personal employment activity. |
| CON-004 | The first supported search location is Zaragoza and the first work modality target is on-site. | The project is intentionally scoped to a focused personal job search. |
| CON-005 | Automatic application submission is excluded from the initial release. | Future automation requires additional consent, validation, portal compatibility, and risk controls. |

## 6. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Portal access restrictions prevent reliable automated collection from one or more target portals. | Fewer offers are collected, reducing usefulness of the product. | Prefer official APIs or permitted access methods, make connector health visible, and allow portal-specific fallback strategies. |
| Offer text is ambiguous about seniority, modality, or location. | Relevant offers may be missed or non-matching offers may be notified. | Store filter reasoning where practical and allow manual review of accepted and rejected offers. |
| LinkedIn or other portals redirect to external destinations inconsistently. | Application portal statistics may be incomplete. | Store source portal and best-known application destination separately, with unknown values allowed when destination cannot be confirmed. |
| WhatsApp provider configuration or approval blocks notifications. | Matching offers are stored but not delivered promptly. | Keep notification delivery separate from collection and expose failed notification states for retry or manual inspection. |
| Stored data is not structured enough for future application automation. | Future automatic application work requires expensive data migration. | Define stable offer fields early and preserve source and destination metadata from the first version. |

## 7. Success Criteria

The initiative is successful when:

- The system can run collection against LinkedIn, InfoJobs, and Tecnoempleo, subject to permitted access paths.
- At least 90% of notified offers match the configured search profile after user review.
- Every accepted offer stores company name, job description, source portal, and application destination when available.
- Matching offers can be delivered to the user's personal phone through WhatsApp within 15 minutes of a successful collection cycle.
- The backend can return aggregated counts by source portal and application destination.
- The frontend can display portal usage statistics without direct database access.

## References

- App Busqueda Empleo Vision and Scope Document
- Aelium Organizational Test Policy
- Aelium Organizational Test Strategy
- IEEE 830-1998 Software Requirements Specification
- BABOK Guide (IIBA)
