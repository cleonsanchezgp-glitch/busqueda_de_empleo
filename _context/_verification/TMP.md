# App Busqueda Empleo - Test Management Plan

## Title

| Field | Value |
| --- | --- |
| Document | Test Management Plan |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - for review |
| Author | Quaestor |
| Reviewers | Aelium |
| Organization | Aelium |
| Last Updated | 2026-09-12 |

## 1. Introduction

### 1.1 Purpose

This Test Management Plan defines risk-based verification for App Busqueda Empleo. It aligns to the Aelium Organizational Test Policy and Test Strategy, consumes the project's SQCA high-priority findings, and plans tests for the current Specification without claiming execution evidence.

### 1.2 Basis

The plan is based on:

- VSD objectives `OBJ-001` through `OBJ-006`.
- BRD requirements `REQ-001` through `REQ-012`.
- Functional requirements `FR-001` through `FR-018`.
- Non-functional requirements `NFR-001` through `NFR-024`.
- Architecture decisions `ADR-001` through `ADR-013`.
- SQCA high-priority findings for functional suitability, time behaviour, interoperability, reliability, security, maintainability, and safety.

## 2. Test Objectives

| Objective | Description |
| --- | --- |
| TO-001 | Verify that offer collection, normalization, filtering, duplicate handling, and run-status recording satisfy the specified personal search profile flow. |
| TO-002 | Verify that accepted offers are persisted before notification and preserve source portal, application destination, classification, and notification state. |
| TO-003 | Verify that WhatsApp notification integration is isolated behind a provider boundary and produces recoverable delivery states. |
| TO-004 | Verify that backend APIs expose accepted offers and statistics accurately and quickly enough for frontend use. |
| TO-005 | Verify that the frontend distinguishes source portals, application destinations, unknown values, empty states, and recoverable failures. |
| TO-006 | Verify security, privacy, safe-failure, and portal-compliance expectations before any non-local exposure or production use. |

## 3. Test Scope

### In Scope

- Unit tests for connector contracts, normalization, filtering, duplicate detection, persistence, aggregation, message formatting, and configuration loading.
- Integration tests for frontend/backend API contracts, database persistence, scheduler boundaries, notification adapter mocks, and connector failure behavior.
- System and end-to-end tests for collection-to-storage-to-notification eligibility and dashboard statistics display.
- Performance checks for notification queue latency and statistics API response time.
- Security and configuration checks for secrets, local/non-local access controls, and sensitive data handling.
- Safety checks for disallowed portal access, rate limiting, uncertain classifications, unknown destinations, and failed notifications.

### Out of Scope

- Live automated scraping against portals when access permission is not established.
- Sending real WhatsApp messages without an approved provider test mode or explicit production release approval.
- Automatic application submission, CV generation, cover-letter generation, or multi-user account workflows.
- Browser/device matrix testing beyond the initial personal-use dashboard unless the frontend deployment target expands.

## 4. Test Strategy

| Level | Description |
| --- | --- |
| Unit Testing | Required for core rules and boundaries: filtering criteria, normalization, duplicate signals, aggregation, message formatting, configuration validation, and failure-state mapping. |
| Integration Testing | Required for cross-component contracts: connector adapters through the common interface, persistence before notification, API response schemas, frontend API consumption, provider mock responses, and database state transitions. |
| System Testing | Required for the full MVP workflow from a controlled collection input through accepted-offer storage, notification candidate creation, and statistics rendering. |
| End-to-End Testing | Planned with controlled fixtures and provider mocks first; real external endpoints require documented permission and safe credentials. |
| Acceptance Testing | Confirms that notified offers match the target profile, stored data supports review/future automation, and statistics are usable without database access. |

## 5. Test Environment

| Environment | Description |
| --- | --- |
| Local development | Runs unit and integration tests with local service instances, fixtures, and mocked external providers. |
| CI / GitHub Actions | Executes automated unit, integration, lint/security checks, and produces retained run logs as verification evidence. |
| Staging-like controlled environment | Used when a concrete deployment stack exists; validates database migrations, frontend/backend integration, connector mocks, and provider sandbox behavior. |
| Production | Not a test execution environment for destructive or exploratory checks. Production evidence is limited to monitored run status, incident reports, and explicitly approved smoke checks. |

Dedicated test-infrastructure work is not planned as a separate Initiative at this point because the Specification and ADD do not describe a separate environment platform, paid test service, or test-data pipeline with its own timeline. If BrowserStack, provider sandboxes, anonymized datasets, or dedicated staging infrastructure become substantial work, Rector should add Planning items for that effort.

## 6. Test Data

Test data uses synthetic job offers covering accepted, rejected, review-needed, duplicate, unknown-destination, failed-connector, and failed-notification states. Fixtures must include LinkedIn, InfoJobs, and Tecnoempleo examples, plus representative redirected application destinations and company career pages.

Real personal phone numbers, provider credentials, and real job-search metadata must not be committed. Any production-like data used for debugging must be minimized, protected, and removed from test fixtures unless explicitly approved.

## 7. Automation Strategy

Automated tests should run in GitHub Actions as the declared verification execution authority. Evidence should be retained as GitHub Actions run URLs, logs, artifacts, coverage summaries, and security-scan outputs referenced by future Evidence IDs (`EVD-xxx`).

The initial automation suite should prioritize:

- Unit and contract coverage for High SQCA findings.
- Integration tests for storage-before-notification and API/frontend contracts.
- Negative tests for restricted portal access, provider failures, and uncertain offer classification.
- Regression checks for filtering rules and statistics aggregation whenever connector, model, or API behavior changes.

## 8. Defect Management

Defects found during testing are recorded as GitHub issues linked to the relevant `FR-xxx`, `NFR-xxx`, `TEST-xxx`, and, where applicable, the affected Planning item. Each defect should state severity, reproduction steps, observed result, expected result, evidence link, owner, and retest expectation.

Critical or High issues affecting personal data, notification correctness, portal compliance, persistence integrity, or safe failure block release until fixed, mitigated with documented acceptance, or explicitly deferred with residual risk.

## 9. Metrics and Reporting

| Metric | Description |
| --- | --- |
| Requirement coverage | Percentage of in-scope `FR-xxx` and `NFR-xxx` requirements mapped to at least one planned or executed `TEST-xxx`. |
| Risk coverage | Coverage and execution status for High-priority SQCA subcharacteristics. |
| Pass/fail/blocked rate | Counts of planned tests by latest execution status once evidence exists. |
| Defect severity distribution | Open and closed defects grouped by severity and affected component. |
| Notification latency | Percentage of accepted offers queued for notification within 15 minutes of collection completion. |
| API response time | 95th percentile statistics API response time for the initial personal-use dataset. |
| Regression health | Whether critical filtering, persistence, notification, and statistics checks remain passing after change. |

## 10. Traceability

The Verification chain is `Requirement -> Test -> Evidence`. Evidence is intentionally `TBD` because this bootstrap plans tests; it does not execute them.

| Requirement (FR-xxx / NFR-xxx) | Test (TEST-xxx) | Evidence | Status |
| --- | --- | --- | --- |
| FR-001 | TEST-001 - Verify a controlled collection cycle attempts LinkedIn, InfoJobs, and Tecnoempleo connectors when all are configured. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-002 | TEST-002 - Verify raw portal fixture data is normalized into the common offer fields used downstream. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-003 | TEST-003 - Verify configured seniority, role, modality, and Zaragoza location criteria are applied to each offer. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-004 | TEST-004 - Verify offers are classified as accepted, rejected, or review-needed and rejected offers are not notification-eligible. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-005 | TEST-005 - Verify likely duplicates across portal fixtures are marked without losing uncertain cases. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-006 | TEST-006 - Verify success and failure status is recorded for each portal collection run. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-007 | TEST-007 - Verify accepted offers are persisted with company, description, source portal, application destination, and filter metadata. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-008 | TEST-008 - Verify source portal and application destination remain separate when LinkedIn redirects to another site. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-009 | TEST-009 - Verify unknown application destination is stored without failing an accepted offer. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-010 | TEST-010 - Verify a newly stored accepted offer creates a WhatsApp notification candidate. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-011 | TEST-011 - Verify WhatsApp message formatting includes enough company, role/summary, source, and destination/link information for triage. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-012 | TEST-012 - Verify provider success, rejection, and failure responses are recorded as notification delivery state. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-013 | TEST-013 - Verify the backend returns accepted offers through the internal offer API. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-014 | TEST-014 - Verify the backend aggregates accepted offers by source portal and application destination. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-015 | TEST-015 - Verify the frontend renders statistics returned by the backend API without direct database access. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-016 | TEST-016 - Verify the frontend makes source portal statistics visually and textually distinct from application destination statistics. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-017 | TEST-017 - Verify unknown application destinations appear as their own visible statistics category. | TBD - GitHub Actions run/artifact after implementation | Planned |
| FR-018 | TEST-018 - Verify API responses preserve source, destination, and job metadata needed for future automation analysis. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-001 | TEST-019 - Verify notification candidates are queued within the 15-minute target in a controlled timing test. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-002 | TEST-020 - Verify the statistics API 95th percentile response time remains under 2 seconds for the initial dataset size. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-003 | TEST-021 - Verify connector scheduling and retry behavior respect configured rate limits and backoff. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-004 | TEST-022 - Verify connectors are isolated behind a common contract by disabling one portal without rewriting another connector. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-005 | TEST-023 - Verify WhatsApp credentials and provider responses are handled only through the notification adapter boundary. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-006 | TEST-024 - Verify offer/statistics API responses use stable documented structures and can be versioned. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-007 | TEST-025 - Verify WhatsApp notification content is understandable without opening the frontend. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-008 | TEST-026 - Verify the statistics frontend distinguishes source and destination dimensions for a first-time user review. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-009 | TEST-027 - Verify frontend states distinguish no data, API failure, and unknown application destination. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-010 | TEST-028 - Verify one portal connector failure does not stop remaining configured connectors. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-011 | TEST-029 - Verify accepted offers are persisted before notification success can be reported. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-012 | TEST-030 - Verify failed or blocked notification attempts retain enough state for retry or manual follow-up. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-013 | TEST-031 - Verify secrets and phone numbers are not committed and sensitive configuration loads from protected runtime configuration. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-014 | TEST-032 - Verify non-public backend offer/statistics endpoints enforce intended local or authenticated access before non-local exposure. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-015 | TEST-033 - Verify offer identity, source portal, application destination, and classification cannot be silently overwritten without an auditable update path. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-016 | TEST-034 - Verify collection, filtering, storage, notification, API, and frontend responsibilities can be tested independently. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-017 | TEST-035 - Verify accepted, rejected, and review-needed offers retain enough metadata to explain the classification. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-018 | TEST-036 - Verify core offer identity and destination fields remain stable for future automation analysis. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-019 | TEST-037 - Verify seniority, role, modality, and city search-profile values can change through configuration without code changes. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-020 | TEST-038 - Verify a future portal can be added by implementing the connector contract and configuration. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-021 | TEST-039 - Verify notification provider replacement does not require changes to collection or storage logic. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-022 | TEST-040 - Verify restricted or disallowed portal access is recorded and stopped/backed off instead of bypassed. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-023 | TEST-041 - Verify insufficient classification confidence marks an offer for manual review rather than accepted notification. | TBD - GitHub Actions run/artifact after implementation | Planned |
| NFR-024 | TEST-042 - Verify automatic application submission is disabled and cannot be triggered by notification or statistics flows. | TBD - GitHub Actions run/artifact after implementation | Planned |

## 11. Evidence Contract

Future evidence should use stable `EVD-xxx` identifiers and link to GitHub Actions run URLs, test reports, logs, screenshots, coverage summaries, security scan outputs, or approved manual review notes. A test may move from `Planned` to `Pass`, `Fail`, or `Blocked` only when an evidence reference exists.

## References

- App Busqueda Empleo SQCA
- App Busqueda Empleo VSD
- App Busqueda Empleo BRD
- App Busqueda Empleo FRDs
- App Busqueda Empleo NFRD
- App Busqueda Empleo ADD
- Aelium Organizational Test Policy
- Aelium Organizational Test Strategy
- ISO/IEC 29119-2:2021 Section 7.1
- ISO/IEC/IEEE 29119-3:2021 Section 11
