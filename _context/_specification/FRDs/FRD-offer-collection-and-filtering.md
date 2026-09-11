# Offer Collection and Filtering - Functional Requirements Document

## Document Control

| Field | Value |
| --- | --- |
| Requirement Name | Offer Collection and Filtering |
| ID | FRD-001 |
| Version | 0.1 |
| Author | Consultor |
| Last Updated | 2026-09-11 |

## 1. Overview

This feature collects job offers from the initial supported portals and determines whether each offer matches the configured personal search profile. It covers portal collection runs, normalization of collected offer data, filter evaluation, duplicate detection, and rejection of non-matching offers.

## 2. Actors

| Actor | Description |
| --- | --- |
| Job seeker | Receives matching job opportunities and may later review accepted or rejected offers. |
| Collection scheduler | Starts recurring or manual collection runs. |
| Portal connector | Retrieves offer data from LinkedIn, InfoJobs, or Tecnoempleo through a permitted access method. |
| Filtering engine | Evaluates collected offers against the configured search profile. |
| System | Stores results and exposes collection status to downstream features. |

## 3. Functional Requirements

| ID | Description | Priority | Traces to (REQ-xxx) |
| --- | --- | --- | --- |
| FR-001 | The system shall run a collection process for each configured supported portal. | Must | REQ-001 |
| FR-002 | The system shall normalize collected offer data into a common internal offer structure. | Must | REQ-001, REQ-004 |
| FR-003 | The system shall apply the configured search profile to each collected offer. | Must | REQ-002 |
| FR-004 | The system shall classify each collected offer as accepted, rejected, or needing manual review. | Must | REQ-003 |
| FR-005 | The system shall identify likely duplicate offers collected from the same or different portals. | Should | REQ-003, REQ-004 |
| FR-006 | The system shall record collection run status for each supported portal. | Should | REQ-001 |

## 4. Workflow

1. The collection scheduler starts a collection cycle.
2. The system loads the active search profile.
3. The system invokes the connector for each configured supported portal.
4. Each connector returns raw offer data or an explicit collection failure.
5. The system normalizes raw offers into the common internal structure.
6. The filtering engine evaluates seniority, role, work modality, and location.
7. The system classifies offers as accepted, rejected, or needing manual review.
8. The system marks likely duplicates and records collection run status.
9. Accepted offers become eligible for storage and notification workflows.

## 5. Inputs

| Input | Source |
| --- | --- |
| Supported portal list | Product configuration |
| Search profile | Product configuration |
| Raw LinkedIn offers | LinkedIn connector |
| Raw InfoJobs offers | InfoJobs connector |
| Raw Tecnoempleo offers | Tecnoempleo connector |
| Existing offer identifiers | Stored offer data |

## 6. Outputs

| Output | Destination |
| --- | --- |
| Normalized collected offers | Offer storage feature |
| Offer classification result | Offer storage and notification features |
| Collection run status | Backend API and operational logs |
| Rejected or review-needed offers | Stored offer data or review queue |

## 7. Acceptance Criteria

Each criterion verifies exactly one Functional Requirement.

| ID | Given | When | Then | Verifies |
| --- | --- | --- | --- | --- |
| AC-001 | the supported portals are configured | a collection cycle starts | the system attempts collection for LinkedIn, InfoJobs, and Tecnoempleo | FR-001 |
| AC-002 | a connector returns raw offer data | the system processes the result | the offer is represented with the common internal fields needed downstream | FR-002 |
| AC-003 | an offer contains role, location, modality, and seniority signals | the filter is applied | the system evaluates the offer against all configured search profile criteria | FR-003 |
| AC-004 | an offer does not match the configured profile | the filter result is stored | the offer is not treated as accepted for notification | FR-004 |
| AC-005 | two collected offers share strong duplicate signals | the collection cycle completes | the system marks them as likely duplicates instead of treating them as unrelated opportunities | FR-005 |
| AC-006 | a portal collection succeeds or fails | the collection cycle ends | the system records the portal status and time of the run | FR-006 |

## 8. Error Handling

- If a portal connector is unavailable, the system records the failed portal run and continues processing other configured portals.
- If raw offer data is incomplete, the system classifies the offer as needing manual review when a confident filter decision cannot be made.
- If a portal access method is disallowed or rate-limited, the system records the condition without attempting to bypass the restriction.
- If duplicate detection is uncertain, the system keeps the offer but marks the duplicate confidence as unresolved.

## 9. Interface Requirements

| ID | Interface | Description | Traces to (REQ-xxx) |
| --- | --- | --- | --- |
| INT-001 | Portal connector contract | Each portal connector returns raw offers, collection metadata, and explicit error states through a common connector interface. | REQ-001 |
| INT-002 | Search profile configuration | The filtering engine consumes the active search criteria for seniority, role, modality, and location. | REQ-002 |

## References

- App Busqueda Empleo Business Requirements Document
- IEEE 29148 Requirements Engineering
