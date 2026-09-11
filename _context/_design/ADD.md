# App Busqueda Empleo - Architecture Design Document

## Title

| Field | Value |
| --- | --- |
| Document | Architecture Design Document |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - for review |
| Author | Conditor |
| Reviewers | Aelium |
| Organization | Aelium |
| Last Updated | 2026-09-11 |

## 1. Overview

### 1.1 Purpose

This document describes the initial architecture for App Busqueda Empleo. It converts the current Specification into component responsibilities, system boundaries, data flow, deployment expectations, security considerations, and architecture decisions.

The architecture supports the first product goal: collect job offers from LinkedIn, InfoJobs, and Tecnoempleo; filter them for a focused personal profile; persist accepted offers; send WhatsApp notifications; and expose backend statistics to a frontend dashboard.

### 1.2 Scope

Covered by this ADD:

- Portal collection and connector boundaries.
- Search profile and filtering workflow.
- Normalized offer storage.
- Application destination tracking.
- WhatsApp notification preparation and delivery tracking.
- Backend API for offer and statistics data.
- Frontend statistics dashboard.
- Security, configuration, and deployment considerations for the initial product.

Not covered as implemented architecture in this version:

- Automatic job application submission.
- CV or cover letter generation.
- Multi-user account and permission models.
- A final vendor-specific technology stack.

## 2. Architectural Principles

- **Requirement-traced design:** every architecture decision must address one or more `REQ`, `FR`, or `NFR` identifiers from the Specification.
- **Compliance-aware integration:** external portal and WhatsApp integrations must respect provider permissions, rate limits, and terms of service.
- **Modular boundaries:** portal collection, filtering, persistence, notification, API, and frontend concerns remain separable and independently testable.
- **Data before notification:** accepted offers are persisted before notification success is reported.
- **Source and destination separation:** the portal where an offer is found and the site where the user applies are distinct data fields.
- **Configuration over code edits:** search profile, portal enablement, rate limits, and notification destination are configured outside core application logic.
- **Safe failure:** uncertainty, restricted access, connector failure, and delivery failure must produce explicit states rather than silent loss or misleading output.

## 3. System Context

The system is a personal job-search assistant operated by Aelium for one primary job seeker. It integrates with external job portals as data sources and with an approved WhatsApp-compatible provider as a notification channel. Stored data is exposed through a backend API and consumed by a frontend dashboard.

### Context Diagram

```text
Job seeker
  |       ^
  |       | WhatsApp alerts and statistics dashboard
  v       |
Frontend dashboard
  |
  v
Backend API
  |
  +--> Offer database
  |
  +--> Collection scheduler
  |      |
  |      +--> LinkedIn connector
  |      +--> InfoJobs connector
  |      +--> Tecnoempleo connector
  |
  +--> Filtering engine
  |
  +--> Notification service
         |
         +--> WhatsApp messaging provider
```

External systems:

- LinkedIn, InfoJobs, and Tecnoempleo as initial source portals.
- Company career pages or generic application portals as possible application destinations.
- WhatsApp messaging provider for personal phone notifications.

## 4. High-Level Architecture

### Components

| Component | Description |
| --- | --- |
| Collection scheduler | Starts manual or recurring collection cycles and records run status. |
| Portal connector adapters | Encapsulate portal-specific collection logic behind a common connector contract. |
| Normalization service | Converts portal-specific offer data into the internal offer model. |
| Filtering engine | Applies the configured search profile and classifies offers as accepted, rejected, or needing manual review. |
| Duplicate detector | Detects likely duplicate offers across portals using stable offer signals. |
| Offer database | Stores offers, source portal, application destination, classification metadata, and notification state. |
| Notification service | Creates notification candidates, formats WhatsApp messages, and stores delivery attempts. |
| WhatsApp provider adapter | Isolates provider-specific send, status, and error handling. |
| Backend API | Exposes accepted offers, collection status, notification state, and statistics to internal consumers. |
| Statistics service | Aggregates stored offers by source portal and application destination. |
| Frontend dashboard | Displays portal usage statistics, offer summaries, empty states, and recoverable API errors. |
| Configuration store | Holds search profile, enabled portals, connector limits, notification destination, and provider settings. |

## 5. Data Flow

Primary collection and notification flow:

1. The collection scheduler starts a collection cycle.
2. The backend loads enabled portals and the active search profile from configuration.
3. Each portal connector collects raw offers using the permitted access method available for that portal.
4. The normalization service maps raw offers into the internal offer model.
5. The filtering engine evaluates seniority, role, modality, and Zaragoza location.
6. The duplicate detector compares the offer against existing stored offers.
7. Accepted, rejected, and review-needed offers are persisted with classification metadata.
8. Newly accepted offers create notification candidates.
9. The notification service formats a WhatsApp message and sends it through the provider adapter.
10. Delivery status and provider response metadata are stored.

Statistics flow:

1. The job seeker opens the frontend dashboard.
2. The frontend requests statistics from the backend API.
3. The statistics service reads accepted offers from the database.
4. The service aggregates counts by source portal and application destination.
5. The backend returns structured statistics.
6. The frontend renders source portal and application destination views separately, including unknown destinations.

Core offer fields:

- Offer identity.
- Company name.
- Job title or inferred role summary when available.
- Job description.
- Source portal.
- Application destination.
- Location.
- Work modality.
- Seniority or experience signal.
- Collection timestamp.
- Classification status.
- Filter reasoning metadata.
- Notification status.

## 6. Technology Stack

The exact implementation stack remains open. The architectural stack is defined by responsibility and contract rather than a forced vendor choice.

| Layer | Technology |
| --- | --- |
| Frontend | Web frontend consuming backend API responses; concrete framework TBD. |
| Backend | API service plus background worker or scheduler; concrete runtime TBD. |
| AI Layer | Optional future extraction/ranking assistance only; not required for the initial architecture. |
| Infrastructure | Local development environment first, with staging and production deployment choices TBD. |
| Database | Structured persistent store suitable for offer records, statistics queries, and future automation metadata; concrete engine TBD. |
| External connectors | Adapter-based integration with LinkedIn, InfoJobs, Tecnoempleo, and WhatsApp provider boundaries. |

## 7. Deployment Architecture

### Development

Development may run all components locally: backend API, worker or scheduler, database, frontend, and provider mocks. External integrations should use sandbox, mock, or controlled test modes where providers support them.

### Staging

Staging should validate connector behavior, API contracts, database migrations, notification formatting, dashboard rendering, and failure states without sending unintended messages to the user's personal phone.

### Production

Production is the daily personal-use environment. It should use protected runtime configuration for secrets and phone numbers, persistent database storage, controlled collection schedules, explicit connector rate limits, and monitored notification delivery state.

## 8. Security Considerations

### Authentication

The initial product is personal-use, but backend endpoints should not be exposed publicly without authentication. Local development may use local-only access controls. Any non-local deployment must define an authentication mechanism before exposing offer data or notification controls.

### Authorization

The initial authorization model is single-owner access. Future multi-user support is out of scope and requires a new requirement and architecture decision before implementation.

### Data Protection

Sensitive data includes personal phone numbers, provider credentials, job-search metadata, stored offer data, and application links. Secrets must be loaded through protected runtime configuration and must not be committed to source-controlled files. Stored offer data must preserve source and destination integrity and should retain auditable update paths for important identity fields.

External portal access must stop or back off when access is restricted, rate-limited, or disallowed. The system must not attempt to bypass portal restrictions.

## 9. Architecture Decisions

| ID | Decision | Rationale |
| --- | --- | --- |
| ADR-001 | Use adapter-based portal connectors for LinkedIn, InfoJobs, and Tecnoempleo. | Portal access rules, data shapes, and failure modes differ; adapters isolate that variability behind a common contract. |
| ADR-002 | Normalize all collected offers into a shared internal offer model before filtering or storage. | Filtering, duplicate detection, storage, notifications, and statistics need stable fields independent of the source portal. |
| ADR-003 | Keep the search profile configuration-driven rather than hardcoded into connector logic. | The target role, seniority, modality, and city may change without changing application code. |
| ADR-004 | Classify offers as accepted, rejected, or needing manual review. | Offer text can be ambiguous; a review-needed state avoids misleading notifications and preserves analysis data. |
| ADR-005 | Store source portal and application destination as separate fields. | LinkedIn and other portals may redirect to company or generic application sites, and statistics require both dimensions. |
| ADR-006 | Persist accepted offers before reporting notification success. | Stored evidence and retry capability are required even when WhatsApp delivery fails or is delayed. |
| ADR-007 | Use a notification service plus provider adapter for WhatsApp delivery. | Provider-specific rules, credentials, errors, and replacement risk should not spread through collection or storage logic. |
| ADR-008 | Expose offer and statistics data through the backend API rather than direct frontend database access. | The backend protects data access, centralizes aggregation, and gives the frontend a stable contract. |
| ADR-009 | Aggregate source portal and application destination statistics in the backend. | Central aggregation avoids duplicating business rules in the frontend and keeps statistics consistent. |
| ADR-010 | Treat unknown application destination as a first-class value. | Destination detection may be impossible for some offers; unknown values must remain visible and analyzable. |
| ADR-011 | Keep automatic application submission disabled and outside the initial runtime flows. | Future application automation has additional consent, compliance, portal, and safety concerns beyond the first release. |
| ADR-012 | Store connector run status, filter reasoning, and notification delivery state. | These states support reliability, troubleshooting, user trust, and future automation analysis. |
| ADR-013 | Defer concrete technology/vendor selection while fixing component contracts and data boundaries. | The current specification needs architectural boundaries now, but the user has not selected a stack; premature vendor decisions would be speculative. |

## 10. Requirements Addressed

Links each architecture decision back to the requirement(s) it satisfies.

| Decision (ADR-xxx) | Requirement(s) satisfied | Notes |
| --- | --- | --- |
| ADR-001 | REQ-001, FR-001, FR-006, NFR-004, NFR-010, NFR-020, NFR-022 | Supports portal-specific collection while preserving safe failure and extensibility. |
| ADR-002 | REQ-001, REQ-004, REQ-005, FR-002, FR-007, NFR-018 | Establishes the common data foundation for filtering, storage, statistics, and future automation. |
| ADR-003 | REQ-002, FR-003, NFR-019 | Keeps the personal search profile configurable. |
| ADR-004 | REQ-003, FR-004, NFR-017, NFR-023 | Avoids false-positive notifications and preserves review states. |
| ADR-005 | REQ-005, REQ-006, REQ-010, FR-008, FR-009, FR-014, FR-016, FR-017, NFR-015 | Separates discovery source from final application destination. |
| ADR-006 | REQ-004, REQ-007, FR-007, FR-010, FR-012, NFR-011, NFR-012 | Prevents notification failures from losing accepted offer data. |
| ADR-007 | REQ-007, REQ-008, FR-010, FR-011, FR-012, NFR-005, NFR-007, NFR-021 | Provides a replaceable WhatsApp delivery boundary. |
| ADR-008 | REQ-009, REQ-011, FR-013, FR-015, NFR-006, NFR-014 | Gives the frontend controlled access through backend contracts. |
| ADR-009 | REQ-010, FR-014, FR-016, NFR-002, NFR-006 | Centralizes statistics behavior in the backend. |
| ADR-010 | REQ-006, REQ-010, FR-009, FR-017, NFR-009 | Keeps incomplete destination data visible rather than hiding it. |
| ADR-011 | REQ-012, NFR-024 | Protects the first release from unintended automatic application behavior. |
| ADR-012 | REQ-001, REQ-002, REQ-003, REQ-007, FR-006, FR-012, NFR-010, NFR-012, NFR-017 | Provides operational evidence for collection, filtering, and notification workflows. |
| ADR-013 | REQ-001, REQ-009, REQ-011, NFR-016, NFR-020, NFR-021 | Lets implementation choose appropriate technologies while preserving required boundaries. |
