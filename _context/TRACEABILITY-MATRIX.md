# App Busqueda Empleo - Traceability Matrix

## Title

| Field | Value |
| --- | --- |
| Document | Traceability Matrix |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - generated projection |
| Author | Vestigator |
| Reviewers | Aelium |
| Organization | Aelium |
| Last Updated | 2026-09-12 |

## 1. Purpose

This matrix is a derived projection across Specification, Design, Planning, Time, and Verification. It is not the authority for any requirement, work item, decision, test, evidence, or status. Source Markdown remains authoritative for Specification, Design, and Verification Definition; GitHub Project 3 remains authoritative for Planning and Time; GitHub Actions is the declared verification execution authority.

## 2. ID Prefix Registry

| Semantic entity | Classic | Dimension |
| --- | --- | --- |
| Objective | `OBJ-xxx` | Specification |
| Requirement | `REQ-xxx` | Specification |
| Functional Requirement | `FR-xxx` | Specification |
| Quality Requirement | `NFR-xxx` | Specification |
| Acceptance Criterion | `AC-xxx` | Specification |
| Architecture Decision | `ADR-xxx` | Design |
| Initiative | `INI-xxx` | Planning |
| Project | `PRJ-xxx` | Planning |
| Work Package | `WP-xxx` | Planning |
| Task | `TSK-xxx` | Planning |
| Test | `TEST-xxx` | Verification |
| Evidence | `EVD-xxx` | Verification |

## 3. Matrix

| ID | Type | Description | Parent | Addressed by (decision) | Realized by (work package) | Verified by (test) | Evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBJ-001 | Objective | Collect job offers from LinkedIn, InfoJobs, and Tecnoempleo for the configured search profile. |  |  |  |  |  |  |
| OBJ-002 | Objective | Filter collected offers against seniority, role, work modality, and location requirements. |  |  |  |  |  |  |
| OBJ-003 | Objective | Preserve job offer data needed for review and future automation. |  |  |  |  |  |  |
| OBJ-004 | Objective | Notify the user through WhatsApp when suitable offers are found. |  |  |  |  |  |  |
| OBJ-005 | Objective | Provide backend statistics about application portal usage. |  |  |  |  |  |  |
| OBJ-006 | Objective | Provide a frontend view for statistical analysis of stored offers. |  |  |  |  |  |  |
| REQ-001 | Requirement | The product shall collect job offers from LinkedIn, InfoJobs, and Tecnoempleo as the initial supported portals. | OBJ-001 | ADR-001, ADR-002, ADR-012, ADR-013 |  |  |  |  |
| REQ-002 | Requirement | The product shall support a configurable search profile for junior or approximately 2 to 3 years of experience maximum, software developer role, on-site modality, and Zaragoza location. | OBJ-002 | ADR-003, ADR-012 |  |  |  |  |
| REQ-003 | Requirement | The product shall exclude or mark as non-matching offers that do not satisfy the configured search profile. | OBJ-002 | ADR-004, ADR-012 |  |  |  |  |
| REQ-004 | Requirement | The product shall store accepted offer data needed for later review and automation. | OBJ-003 | ADR-002, ADR-006 |  |  |  |  |
| REQ-005 | Requirement | The stored data for each accepted offer shall include company name, job description, source portal, and application destination when available. | OBJ-003 | ADR-002, ADR-005 |  |  |  |  |
| REQ-006 | Requirement | The product shall detect and retain the application destination when an offer redirects from the source portal to another portal or company website. | OBJ-003, OBJ-005 | ADR-005, ADR-010 |  |  |  |  |
| REQ-007 | Requirement | The product shall notify the user through WhatsApp when new accepted offers are available. | OBJ-004 | ADR-006, ADR-007, ADR-012 |  |  |  |  |
| REQ-008 | Requirement | WhatsApp notifications shall contain enough offer information for the user to decide whether to inspect the vacancy. | OBJ-004 | ADR-007 |  |  |  |  |
| REQ-009 | Requirement | The backend shall expose stored offer data through an API for internal frontend consumption. | OBJ-005, OBJ-006 | ADR-008, ADR-013 |  |  |  |  |
| REQ-010 | Requirement | The backend shall provide aggregated statistics showing how often each source portal and application destination appears in stored offers. | OBJ-005 | ADR-005, ADR-009, ADR-010 |  |  |  |  |
| REQ-011 | Requirement | The frontend shall display statistical views based on backend API data without requiring direct database access. | OBJ-006 | ADR-008, ADR-013 |  |  |  |  |
| REQ-012 | Requirement | The product shall preserve a data foundation suitable for future automatic or semi-automatic job application workflows. | OBJ-003, OBJ-005, OBJ-006 | ADR-011 |  |  |  |  |
| FR-001 | Functional Requirement | The system shall run a collection process for each configured supported portal. | REQ-001 | ADR-001 | WP-001 | TEST-001 |  | Planned |
| FR-002 | Functional Requirement | The system shall normalize collected offer data into a common internal offer structure. | REQ-001, REQ-004 | ADR-002 | WP-001 | TEST-002 |  | Planned |
| FR-003 | Functional Requirement | The system shall apply the configured search profile to each collected offer. | REQ-002 | ADR-003 | WP-001 | TEST-003 |  | Planned |
| FR-004 | Functional Requirement | The system shall classify each collected offer as accepted, rejected, or needing manual review. | REQ-003 | ADR-004 | WP-001 | TEST-004 |  | Planned |
| FR-005 | Functional Requirement | The system shall identify likely duplicate offers collected from the same or different portals. | REQ-003, REQ-004 |  | WP-001 | TEST-005 |  | Planned |
| FR-006 | Functional Requirement | The system shall record collection run status for each supported portal. | REQ-001 | ADR-001, ADR-012 | WP-001 | TEST-006 |  | Planned |
| FR-007 | Functional Requirement | The system shall persist every accepted offer with the required offer fields. | REQ-004, REQ-005 | ADR-002, ADR-006 | WP-002 | TEST-007 |  | Planned |
| FR-008 | Functional Requirement | The system shall store source portal and application destination as separate values. | REQ-005, REQ-006 | ADR-005 | WP-002 | TEST-008 |  | Planned |
| FR-009 | Functional Requirement | The system shall allow application destination to be unknown when it cannot be confirmed. | REQ-006 | ADR-005, ADR-010 | WP-002 | TEST-009 |  | Planned |
| FR-010 | Functional Requirement | The system shall create a WhatsApp notification candidate for each new accepted offer. | REQ-007 | ADR-006, ADR-007 | WP-002 | TEST-010 |  | Planned |
| FR-011 | Functional Requirement | The system shall include enough offer information in each WhatsApp message for user triage. | REQ-008 | ADR-007 | WP-002 | TEST-011 |  | Planned |
| FR-012 | Functional Requirement | The system shall record notification delivery status for each notification attempt. | REQ-007 | ADR-006, ADR-007, ADR-012 | WP-002 | TEST-012 |  | Planned |
| FR-013 | Functional Requirement | The backend API shall expose stored accepted offers for internal frontend consumption. | REQ-009 | ADR-008 | WP-003 | TEST-013 |  | Planned |
| FR-014 | Functional Requirement | The backend API shall provide aggregated counts by source portal and application destination. | REQ-010 | ADR-005, ADR-009 | WP-003 | TEST-014 |  | Planned |
| FR-015 | Functional Requirement | The frontend shall display portal usage statistics returned by the backend API. | REQ-011 | ADR-008 | WP-003 | TEST-015 |  | Planned |
| FR-016 | Functional Requirement | The frontend shall distinguish source portal statistics from application destination statistics. | REQ-010, REQ-011 | ADR-005, ADR-009 | WP-003 | TEST-016 |  | Planned |
| FR-017 | Functional Requirement | The statistics view shall support unknown application destinations as a visible category. | REQ-006, REQ-010 | ADR-005, ADR-010 | WP-003 | TEST-017 |  | Planned |
| FR-018 | Functional Requirement | The API and frontend shall preserve data fields needed for future application automation analysis. | REQ-012 |  | WP-003 | TEST-018 |  | Planned |
| NFR-001 | Quality Requirement | Matching offers shall be eligible for WhatsApp notification shortly after a successful collection cycle. | REQ-007 |  | WP-002 | TEST-019 |  | Planned |
| NFR-002 | Quality Requirement | The statistics API shall respond quickly enough for interactive frontend use. | REQ-009, REQ-010, REQ-011 | ADR-009 | WP-003 | TEST-020 |  | Planned |
| NFR-003 | Quality Requirement | Collection jobs shall avoid unnecessary load on external portals. | REQ-001 |  | WP-001 | TEST-021 |  | Planned |
| NFR-004 | Quality Requirement | Portal connectors shall be isolated behind a common connector contract. | REQ-001 | ADR-001 | WP-001 | TEST-022 |  | Planned |
| NFR-005 | Quality Requirement | WhatsApp notification shall integrate through an approved provider boundary. | REQ-007, REQ-008 | ADR-007 | WP-002 | TEST-023 |  | Planned |
| NFR-006 | Quality Requirement | Backend responses shall use stable structured formats for frontend consumption. | REQ-009, REQ-010, REQ-011 | ADR-008, ADR-009 | WP-003 | TEST-024 |  | Planned |
| NFR-007 | Quality Requirement | WhatsApp messages shall be understandable without opening the frontend first. | REQ-008 | ADR-007 | WP-002 | TEST-025 |  | Planned |
| NFR-008 | Quality Requirement | The statistics frontend shall make source portal and application destination concepts visibly distinct. | REQ-010, REQ-011 |  | WP-003 | TEST-026 |  | Planned |
| NFR-009 | Quality Requirement | Empty, failed, and unknown data states shall be visible to the user. | REQ-006, REQ-011 | ADR-010 | WP-003 | TEST-027 |  | Planned |
| NFR-010 | Quality Requirement | Failure in one portal connector shall not stop collection from other configured portals. | REQ-001 | ADR-001, ADR-012 | WP-001 | TEST-028 |  | Planned |
| NFR-011 | Quality Requirement | Offer storage shall avoid data loss for accepted offers. | REQ-004, REQ-007 | ADR-006 | WP-002 | TEST-029 |  | Planned |
| NFR-012 | Quality Requirement | Notification failures shall be recoverable. | REQ-007 | ADR-006, ADR-012 | WP-002 | TEST-030 |  | Planned |
| NFR-013 | Quality Requirement | Personal phone numbers, provider credentials, and job-search metadata shall be protected from unauthorized access. | REQ-007 |  | WP-002 | TEST-031 |  | Planned |
| NFR-014 | Quality Requirement | Backend access to stored offer data shall be controlled. | REQ-009, REQ-011 | ADR-008 | WP-003 | TEST-032 |  | Planned |
| NFR-015 | Quality Requirement | Stored offer data shall preserve integrity across collection, filtering, notification, and statistics workflows. | REQ-004, REQ-005, REQ-006, REQ-012 | ADR-005 | WP-002 | TEST-033 |  | Planned |
| NFR-016 | Quality Requirement | Collection, filtering, storage, notification, API, and frontend responsibilities shall remain modular. | REQ-001, REQ-002, REQ-004, REQ-007, REQ-009, REQ-011 | ADR-013 | WP-003 | TEST-034 |  | Planned |
| NFR-017 | Quality Requirement | Filter decisions shall be analysable during review. | REQ-002, REQ-003 | ADR-004, ADR-012 | WP-001 | TEST-035 |  | Planned |
| NFR-018 | Quality Requirement | The data model shall support future automation without migration of core offer identity fields. | REQ-005, REQ-012 | ADR-002 | WP-003 | TEST-036 |  | Planned |
| NFR-019 | Quality Requirement | The search profile shall be configurable without changing application code. | REQ-002 | ADR-003 | WP-001 | TEST-037 |  | Planned |
| NFR-020 | Quality Requirement | Additional portals shall be supportable through the connector model. | REQ-001, REQ-012 | ADR-001, ADR-013 | WP-001 | TEST-038 |  | Planned |
| NFR-021 | Quality Requirement | The notification provider shall be replaceable if WhatsApp integration constraints change. | REQ-007, REQ-012 | ADR-007, ADR-013 | WP-002 | TEST-039 |  | Planned |
| NFR-022 | Quality Requirement | The system shall fail safely when external portal access is restricted or disallowed. | REQ-001 | ADR-001 | WP-001 | TEST-040 |  | Planned |
| NFR-023 | Quality Requirement | The system shall avoid sending misleading notifications when offer quality is uncertain. | REQ-003, REQ-007 | ADR-004 | WP-001 | TEST-041 |  | Planned |
| NFR-024 | Quality Requirement | Future automatic application workflows shall require explicit additional controls before activation. | REQ-012 | ADR-011 | WP-002 | TEST-042 |  | Planned |
| AC-001 | Acceptance Criterion | the supported portals are configured; a collection cycle starts; the system attempts collection for LinkedIn, InfoJobs, and Tecnoempleo | FR-001 |  |  |  |  |  |
| AC-002 | Acceptance Criterion | a connector returns raw offer data; the system processes the result; the offer is represented with the common internal fields needed downstream | FR-002 |  |  |  |  |  |
| AC-003 | Acceptance Criterion | an offer contains role, location, modality, and seniority signals; the filter is applied; the system evaluates the offer against all configured search profile criteria | FR-003 |  |  |  |  |  |
| AC-004 | Acceptance Criterion | an offer does not match the configured profile; the filter result is stored; the offer is not treated as accepted for notification | FR-004 |  |  |  |  |  |
| AC-005 | Acceptance Criterion | two collected offers share strong duplicate signals; the collection cycle completes; the system marks them as likely duplicates instead of treating them as unrelated opportunities | FR-005 |  |  |  |  |  |
| AC-006 | Acceptance Criterion | a portal collection succeeds or fails; the collection cycle ends; the system records the portal status and time of the run | FR-006 |  |  |  |  |  |
| AC-007 | Acceptance Criterion | an offer has passed the configured filters; the storage workflow runs; the system persists the offer with required fields | FR-007 |  |  |  |  |  |
| AC-008 | Acceptance Criterion | an offer is found in LinkedIn but redirects to a company page; the offer is stored; the source portal remains LinkedIn and the application destination stores the company page when available | FR-008 |  |  |  |  |  |
| AC-009 | Acceptance Criterion | an application destination cannot be confirmed; the offer is stored; the system records an unknown destination without failing the accepted offer | FR-009 |  |  |  |  |  |
| AC-010 | Acceptance Criterion | a newly accepted offer is stored; notification preparation runs; the system creates a WhatsApp notification candidate | FR-010 |  |  |  |  |  |
| AC-011 | Acceptance Criterion | a notification candidate exists; the WhatsApp message is composed; the message includes company name, role or description summary, source portal, and application link or destination when available | FR-011 |  |  |  |  |  |
| AC-012 | Acceptance Criterion | the messaging provider responds to a send attempt; the notification workflow completes; the system stores the delivery status for that attempt | FR-012 |  |  |  |  |  |
| AC-013 | Acceptance Criterion | accepted offers exist in the database; the frontend requests stored offer data; the backend returns the accepted offers through an internal API endpoint | FR-013 |  |  |  |  |  |
| AC-014 | Acceptance Criterion | accepted offers include source portal and application destination values; the statistics endpoint is requested; the backend returns aggregated counts for both dimensions | FR-014 |  |  |  |  |  |
| AC-015 | Acceptance Criterion | the backend returns statistics data; the user opens the frontend statistics view; the frontend displays portal usage statistics without direct database access | FR-015 |  |  |  |  |  |
| AC-016 | Acceptance Criterion | statistics include both source portal and application destination dimensions; the frontend renders the view; the user can tell which values represent discovery source and which represent application destination | FR-016 |  |  |  |  |  |
| AC-017 | Acceptance Criterion | at least one accepted offer has no confirmed application destination; statistics are displayed; unknown destinations appear as their own visible category | FR-017 |  |  |  |  |  |
| AC-018 | Acceptance Criterion | stored offer data includes fields relevant to future automation; the API returns offer details or statistics; the response preserves source, destination, and job metadata needed for future analysis | FR-018 |  |  |  |  |  |
| AC-019 | Acceptance Criterion | a collection cycle completes successfully with accepted offers; notification preparation runs; 95% of accepted offers are queued within 15 minutes | NFR-001 |  |  |  |  |  |
| AC-020 | Acceptance Criterion | the initial personal-use dataset is loaded; the frontend requests statistics; 95% of statistics API responses complete in under 2 seconds | NFR-002 |  |  |  |  |  |
| AC-021 | Acceptance Criterion | a connector reaches a configured rate or retry limit; collection continues; the connector backs off according to configuration | NFR-003 |  |  |  |  |  |
| AC-022 | Acceptance Criterion | one portal connector is disabled; another configured connector runs; the remaining connector completes without code changes to its logic | NFR-004 |  |  |  |  |  |
| AC-023 | Acceptance Criterion | the WhatsApp provider adapter is configured; a notification is sent; provider-specific delivery status is captured through the adapter boundary | NFR-005 |  |  |  |  |  |
| AC-024 | Acceptance Criterion | the frontend consumes offer or statistics data; the backend response changes in the future; the response can be versioned without breaking existing consumers silently | NFR-006 |  |  |  |  |  |
| AC-025 | Acceptance Criterion | a WhatsApp notification is received; the user reads it; the user can identify the company, role or summary, source portal, and destination status | NFR-007 |  |  |  |  |  |
| AC-026 | Acceptance Criterion | the statistics view is opened for the first time; source and destination data are displayed; the two concepts are visually and textually distinct | NFR-008 |  |  |  |  |  |
| AC-027 | Acceptance Criterion | the system has no data, an API failure, or unknown destinations; the frontend renders the statistics area; the state shown matches the actual condition | NFR-009 |  |  |  |  |  |
| AC-028 | Acceptance Criterion | a portal connector fails; a collection cycle includes other configured portals; the other portals are still attempted | NFR-010 |  |  |  |  |  |
| AC-029 | Acceptance Criterion | an accepted offer is ready for notification; the notification workflow starts; the offer is persisted before delivery is marked successful | NFR-011 |  |  |  |  |  |
| AC-030 | Acceptance Criterion | a WhatsApp send attempt fails; the workflow records the result; retry or manual follow-up has the required state | NFR-012 |  |  |  |  |  |
| AC-031 | Acceptance Criterion | sensitive configuration is needed; the application is configured; secrets and phone numbers are not committed to source-controlled files | NFR-013 |  |  |  |  |  |
| AC-032 | Acceptance Criterion | backend data endpoints are exposed beyond local development; a request is made; the request is subject to the intended access control | NFR-014 |  |  |  |  |  |
| AC-033 | Acceptance Criterion | stored offer identity or portal fields are updated; the update is saved; the previous value is not silently lost without an auditable path | NFR-015 |  |  |  |  |  |
| AC-034 | Acceptance Criterion | a responsibility such as filtering or notification changes; tests are planned; that responsibility can be tested independently | NFR-016 |  |  |  |  |  |
| AC-035 | Acceptance Criterion | an offer is accepted, rejected, or marked for review; the user or maintainer inspects it; the stored metadata explains the classification basis | NFR-017 |  |  |  |  |  |
| AC-036 | Acceptance Criterion | future automation analysis uses stored offers; stored data is inspected; core offer identity and destination fields are present without migration | NFR-018 |  |  |  |  |  |
| AC-037 | Acceptance Criterion | the target city or role changes; the search profile is updated; the change can be made without code changes | NFR-019 |  |  |  |  |  |
| AC-038 | Acceptance Criterion | a new portal is proposed; the architecture is inspected; the connector contract provides a defined extension point | NFR-020 |  |  |  |  |  |
| AC-039 | Acceptance Criterion | WhatsApp provider constraints change; the notification provider is replaced; core offer collection and storage logic remain unchanged | NFR-021 |  |  |  |  |  |
| AC-040 | Acceptance Criterion | a portal access path is restricted; the connector detects the restriction; the connector stops or backs off instead of bypassing the restriction | NFR-022 |  |  |  |  |  |
| AC-041 | Acceptance Criterion | an offer has insufficient classification confidence; filtering completes; the offer is marked for review instead of notified as accepted | NFR-023 |  |  |  |  |  |
| AC-042 | Acceptance Criterion | current release workflows execute; automatic application behavior is requested; the system does not submit applications automatically | NFR-024 |  |  |  |  |  |

## 4. Gap Checklist

| # | Check | Current finding |
| --- | --- | --- |
| 1 | Requirement with no implementation | None found for FR/NFR rows against GitHub Work Package specifications. |
| 2 | Requirement with no test | None found for FR/NFR rows against TMP traceability. |
| 3 | Orphan task or work package | None found among GitHub Work Packages inspected by `qualitas:planning` label. |
| 4 | Requirement modified after verification | Not assessed: no execution evidence dates exist yet. |
| 5 | NFR with no evidence | All NFR tests are planned and currently unevidenced; this is expected until GitHub Actions evidence exists. |
| 6 | Work closed but requirement still open | Not found: GitHub Project items are currently `Todo`, and no requirement has verified status. |

## 5. Bidirectional Audit Findings

| Category | Count | Finding |
| --- | --- | --- |
| Dangling reference | 0 | None found. |
| Orphan Work Package | 0 | None found. |
| Unimplemented requirement | 0 | None found. |
| Untested requirement | 0 | None found. |
| Unevidenced test | 42 | Expected for bootstrap: 42 planned tests have no `EVD-xxx` evidence yet. |
| Orphan test | 0 | None found. |
| Stale verification | 0 | Not assessed beyond absence of evidence: no trustworthy execution evidence dates exist yet. |

## 6. Source Counts

| Entity | Count | Authority |
| --- | --- | --- |
| Objectives | 6 | Markdown VSD |
| Requirements | 12 | Markdown BRD |
| Functional Requirements | 18 | Markdown FRDs |
| Quality Requirements | 24 | Markdown NFRD |
| Acceptance Criteria | 42 | Markdown FRDs/NFRD |
| Architecture Decisions | 13 | Markdown ADD |
| Planning items | 23 | GitHub Project 3 REST |
| Tests | 42 | Markdown TMP |

## References

- `_context/MANAGEMENT-MODEL.yaml`
- `_context/VSD.md`
- `_context/_specification/BRD.md`
- `_context/_specification/FRDs/`
- `_context/_specification/NFRD.md`
- `_context/_design/ADD.md`
- GitHub Project 3 planning issues labelled `qualitas:planning`
- `_context/_verification/SQCA.md`
- `_context/_verification/TMP.md`
