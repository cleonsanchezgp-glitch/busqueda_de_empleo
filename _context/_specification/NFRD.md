# App Busqueda Empleo - Non-Functional Requirements Document

## Title

| Field | Value |
| --- | --- |
| Document | Non-Functional Requirements Document |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - for review |
| Author | Consultor |
| Reviewers | Aelium |
| Organization | Aelium |
| Last Updated | 2026-09-11 |

## 1. Overview

This document defines non-functional requirements for App Busqueda Empleo using the ISO/IEC 25010:2023 product quality characteristics outside Functional Suitability. Functional behavior is defined in the FRDs; this document defines measurable quality expectations for collection, filtering, storage, WhatsApp notification, backend API, frontend statistics, security, maintainability, and future automation readiness.

Each requirement has a permanent `NFR-xxx` ID, traces to one or more `REQ-xxx` entries in the BRD, and is verified by one or more acceptance criteria.

## 2. Performance Efficiency

*Time behaviour, resource utilization, capacity.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-001 | Matching offers shall be eligible for WhatsApp notification shortly after a successful collection cycle. | 95% of accepted offers are queued for notification within 15 minutes of collection completion. | REQ-007 | AC-019 |
| NFR-002 | The statistics API shall respond quickly enough for interactive frontend use. | 95th percentile response time under 2 seconds for the initial personal-use dataset size. | REQ-009, REQ-010, REQ-011 | AC-020 |
| NFR-003 | Collection jobs shall avoid unnecessary load on external portals. | Connector scheduling and retry behavior respect configured rate limits and backoff rules. | REQ-001 | AC-021 |

## 3. Compatibility

*Co-existence, interoperability.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-004 | Portal connectors shall be isolated behind a common connector contract. | Adding or disabling one supported portal does not require rewriting unrelated portal logic. | REQ-001 | AC-022 |
| NFR-005 | WhatsApp notification shall integrate through an approved provider boundary. | Provider-specific credentials and delivery responses are handled through a replaceable notification adapter. | REQ-007, REQ-008 | AC-023 |
| NFR-006 | Backend responses shall use stable structured formats for frontend consumption. | API responses for offers and statistics are documented and versionable before frontend use. | REQ-009, REQ-010, REQ-011 | AC-024 |

## 4. Interaction Capability

*Appropriateness recognisability, learnability, operability, user error protection, user engagement, inclusivity, user assistance, self-descriptiveness.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-007 | WhatsApp messages shall be understandable without opening the frontend first. | Each notification includes company, role or description summary, source portal, and destination or link status when available. | REQ-008 | AC-025 |
| NFR-008 | The statistics frontend shall make source portal and application destination concepts visibly distinct. | A first-time user can identify both dimensions from labels and layout without database knowledge. | REQ-010, REQ-011 | AC-026 |
| NFR-009 | Empty, failed, and unknown data states shall be visible to the user. | The frontend distinguishes no data, failed API load, and unknown application destination states. | REQ-006, REQ-011 | AC-027 |

## 5. Reliability

*Faultlessness, availability, fault tolerance, recoverability.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-010 | Failure in one portal connector shall not stop collection from other configured portals. | A failed connector records failure status and the cycle continues with remaining portals. | REQ-001 | AC-028 |
| NFR-011 | Offer storage shall avoid data loss for accepted offers. | Accepted offers are persisted before notification success is reported. | REQ-004, REQ-007 | AC-029 |
| NFR-012 | Notification failures shall be recoverable. | Failed or blocked notification attempts retain enough state for retry or manual follow-up. | REQ-007 | AC-030 |

## 6. Security

*Confidentiality, integrity, non-repudiation, accountability, authenticity, resistance.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-013 | Personal phone numbers, provider credentials, and job-search metadata shall be protected from unauthorized access. | Secrets are not stored in source-controlled files, and sensitive configuration is loaded from protected runtime configuration. | REQ-007 | AC-031 |
| NFR-014 | Backend access to stored offer data shall be controlled. | Non-public API endpoints require the intended local or authenticated access control before exposure beyond local development. | REQ-009, REQ-011 | AC-032 |
| NFR-015 | Stored offer data shall preserve integrity across collection, filtering, notification, and statistics workflows. | Source portal, application destination, and offer identity cannot be silently overwritten without an auditable update path. | REQ-004, REQ-005, REQ-006, REQ-012 | AC-033 |

## 7. Maintainability

*Modularity, reusability, analysability, modifiability, testability.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-016 | Collection, filtering, storage, notification, API, and frontend responsibilities shall remain modular. | Each responsibility can be tested independently at unit or integration level. | REQ-001, REQ-002, REQ-004, REQ-007, REQ-009, REQ-011 | AC-034 |
| NFR-017 | Filter decisions shall be analysable during review. | Accepted, rejected, and review-needed offers retain enough filter metadata to explain the classification. | REQ-002, REQ-003 | AC-035 |
| NFR-018 | The data model shall support future automation without migration of core offer identity fields. | Company, description, source portal, application destination, collection timestamp, and offer identity are stable fields. | REQ-005, REQ-012 | AC-036 |

## 8. Flexibility

*Adaptability, scalability, installability, replaceability.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-019 | The search profile shall be configurable without changing application code. | Seniority, role, work modality, and location values can be changed through configuration or managed settings. | REQ-002 | AC-037 |
| NFR-020 | Additional portals shall be supportable through the connector model. | A future portal can be added by implementing the connector contract and configuration. | REQ-001, REQ-012 | AC-038 |
| NFR-021 | The notification provider shall be replaceable if WhatsApp integration constraints change. | Notification workflow depends on an adapter contract rather than provider-specific logic spread through the product. | REQ-007, REQ-012 | AC-039 |

## 9. Safety

*Operational constraint, risk identification, fail safe, hazard warning, safe integration.*

| ID | Requirement | Target / Threshold | Traces to (REQ-xxx) | Verifies (AC-xxx) |
| --- | --- | --- | --- | --- |
| NFR-022 | The system shall fail safely when external portal access is restricted or disallowed. | The connector records the restriction and stops that access path rather than bypassing limits. | REQ-001 | AC-040 |
| NFR-023 | The system shall avoid sending misleading notifications when offer quality is uncertain. | Offers with insufficient confidence are marked for manual review instead of being sent as accepted offers. | REQ-003, REQ-007 | AC-041 |
| NFR-024 | Future automatic application workflows shall require explicit additional controls before activation. | Automatic application remains disabled in the initial release and cannot be triggered by current notification or statistics flows. | REQ-012 | AC-042 |

## 10. Acceptance Criteria

| ID | Given | When | Then | Verifies |
| --- | --- | --- | --- | --- |
| AC-019 | a collection cycle completes successfully with accepted offers | notification preparation runs | 95% of accepted offers are queued within 15 minutes | NFR-001 |
| AC-020 | the initial personal-use dataset is loaded | the frontend requests statistics | 95% of statistics API responses complete in under 2 seconds | NFR-002 |
| AC-021 | a connector reaches a configured rate or retry limit | collection continues | the connector backs off according to configuration | NFR-003 |
| AC-022 | one portal connector is disabled | another configured connector runs | the remaining connector completes without code changes to its logic | NFR-004 |
| AC-023 | the WhatsApp provider adapter is configured | a notification is sent | provider-specific delivery status is captured through the adapter boundary | NFR-005 |
| AC-024 | the frontend consumes offer or statistics data | the backend response changes in the future | the response can be versioned without breaking existing consumers silently | NFR-006 |
| AC-025 | a WhatsApp notification is received | the user reads it | the user can identify the company, role or summary, source portal, and destination status | NFR-007 |
| AC-026 | the statistics view is opened for the first time | source and destination data are displayed | the two concepts are visually and textually distinct | NFR-008 |
| AC-027 | the system has no data, an API failure, or unknown destinations | the frontend renders the statistics area | the state shown matches the actual condition | NFR-009 |
| AC-028 | a portal connector fails | a collection cycle includes other configured portals | the other portals are still attempted | NFR-010 |
| AC-029 | an accepted offer is ready for notification | the notification workflow starts | the offer is persisted before delivery is marked successful | NFR-011 |
| AC-030 | a WhatsApp send attempt fails | the workflow records the result | retry or manual follow-up has the required state | NFR-012 |
| AC-031 | sensitive configuration is needed | the application is configured | secrets and phone numbers are not committed to source-controlled files | NFR-013 |
| AC-032 | backend data endpoints are exposed beyond local development | a request is made | the request is subject to the intended access control | NFR-014 |
| AC-033 | stored offer identity or portal fields are updated | the update is saved | the previous value is not silently lost without an auditable path | NFR-015 |
| AC-034 | a responsibility such as filtering or notification changes | tests are planned | that responsibility can be tested independently | NFR-016 |
| AC-035 | an offer is accepted, rejected, or marked for review | the user or maintainer inspects it | the stored metadata explains the classification basis | NFR-017 |
| AC-036 | future automation analysis uses stored offers | stored data is inspected | core offer identity and destination fields are present without migration | NFR-018 |
| AC-037 | the target city or role changes | the search profile is updated | the change can be made without code changes | NFR-019 |
| AC-038 | a new portal is proposed | the architecture is inspected | the connector contract provides a defined extension point | NFR-020 |
| AC-039 | WhatsApp provider constraints change | the notification provider is replaced | core offer collection and storage logic remain unchanged | NFR-021 |
| AC-040 | a portal access path is restricted | the connector detects the restriction | the connector stops or backs off instead of bypassing the restriction | NFR-022 |
| AC-041 | an offer has insufficient classification confidence | filtering completes | the offer is marked for review instead of notified as accepted | NFR-023 |
| AC-042 | current release workflows execute | automatic application behavior is requested | the system does not submit applications automatically | NFR-024 |

## References

- ISO/IEC 25010:2023 Systems and Software Quality Models
- App Busqueda Empleo Business Requirements Document
- Offer Collection and Filtering FRD
- Offer Storage and WhatsApp Notifications FRD
- Backend Statistics and Frontend Dashboard FRD
