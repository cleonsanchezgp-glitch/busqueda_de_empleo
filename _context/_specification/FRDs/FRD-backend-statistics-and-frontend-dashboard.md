# Backend Statistics and Frontend Dashboard - Functional Requirements Document

## Document Control

| Field | Value |
| --- | --- |
| Requirement Name | Backend Statistics and Frontend Dashboard |
| ID | FRD-003 |
| Version | 0.1 |
| Author | Consultor |
| Last Updated | 2026-09-11 |

## 1. Overview

This feature exposes stored offer data and aggregated portal usage statistics through a backend API, then displays those statistics in a frontend interface. It supports analysis of which source portals and application destinations are most common, including generic portals and company-specific career pages.

## 2. Actors

| Actor | Description |
| --- | --- |
| Job seeker | Views statistics to understand where matching jobs originate and where applications are submitted. |
| Backend API | Provides offer data and statistical aggregations from the database. |
| Frontend interface | Displays backend data in a graphical interface. |
| Database | Stores accepted offers, source portals, application destinations, and notification metadata. |
| System | Applies API access, aggregation, and presentation rules. |

## 3. Functional Requirements

| ID | Description | Priority | Traces to (REQ-xxx) |
| --- | --- | --- | --- |
| FR-013 | The backend API shall expose stored accepted offers for internal frontend consumption. | Must | REQ-009 |
| FR-014 | The backend API shall provide aggregated counts by source portal and application destination. | Must | REQ-010 |
| FR-015 | The frontend shall display portal usage statistics returned by the backend API. | Must | REQ-011 |
| FR-016 | The frontend shall distinguish source portal statistics from application destination statistics. | Should | REQ-010, REQ-011 |
| FR-017 | The statistics view shall support unknown application destinations as a visible category. | Should | REQ-006, REQ-010 |
| FR-018 | The API and frontend shall preserve data fields needed for future application automation analysis. | Should | REQ-012 |

## 4. Workflow

1. The user opens the frontend statistics view.
2. The frontend requests offer statistics from the backend API.
3. The backend reads accepted offer records from the database.
4. The backend aggregates counts by source portal and application destination.
5. The backend returns structured statistics and any relevant totals.
6. The frontend renders the statistics in graphical and tabular form.
7. The user compares which portals and destinations appear most frequently.

## 5. Inputs

| Input | Source |
| --- | --- |
| Stored accepted offers | Database |
| Source portal values | Stored offer data |
| Application destination values | Stored offer data |
| Statistics request | Frontend interface |

## 6. Outputs

| Output | Destination |
| --- | --- |
| Offer list response | Frontend interface |
| Source portal aggregation | Frontend interface |
| Application destination aggregation | Frontend interface |
| Graphical statistics view | Job seeker |

## 7. Acceptance Criteria

Each criterion verifies exactly one Functional Requirement.

| ID | Given | When | Then | Verifies |
| --- | --- | --- | --- | --- |
| AC-013 | accepted offers exist in the database | the frontend requests stored offer data | the backend returns the accepted offers through an internal API endpoint | FR-013 |
| AC-014 | accepted offers include source portal and application destination values | the statistics endpoint is requested | the backend returns aggregated counts for both dimensions | FR-014 |
| AC-015 | the backend returns statistics data | the user opens the frontend statistics view | the frontend displays portal usage statistics without direct database access | FR-015 |
| AC-016 | statistics include both source portal and application destination dimensions | the frontend renders the view | the user can tell which values represent discovery source and which represent application destination | FR-016 |
| AC-017 | at least one accepted offer has no confirmed application destination | statistics are displayed | unknown destinations appear as their own visible category | FR-017 |
| AC-018 | stored offer data includes fields relevant to future automation | the API returns offer details or statistics | the response preserves source, destination, and job metadata needed for future analysis | FR-018 |

## 8. Error Handling

- If the database is unavailable, the backend returns a controlled error rather than partial or misleading statistics.
- If no accepted offers exist, the frontend displays an empty statistics state.
- If application destination values are missing, the backend groups them under an unknown category.
- If the frontend cannot reach the backend API, it displays a recoverable error state.

## 9. Interface Requirements

| ID | Interface | Description | Traces to (REQ-xxx) |
| --- | --- | --- | --- |
| INT-005 | Offer API | Provides accepted offer data to the frontend from the database. | REQ-009 |
| INT-006 | Statistics API | Provides aggregated counts by source portal and application destination. | REQ-010 |
| INT-007 | Frontend statistics view | Presents source portal and application destination statistics to the user. | REQ-011 |

## References

- App Busqueda Empleo Business Requirements Document
- IEEE 29148 Requirements Engineering
