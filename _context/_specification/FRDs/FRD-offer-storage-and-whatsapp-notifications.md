# Offer Storage and WhatsApp Notifications - Functional Requirements Document

## Document Control

| Field | Value |
| --- | --- |
| Requirement Name | Offer Storage and WhatsApp Notifications |
| ID | FRD-002 |
| Version | 0.1 |
| Author | Consultor |
| Last Updated | 2026-09-11 |

## 1. Overview

This feature persists accepted job offers and sends WhatsApp notifications when new matching offers are available. It keeps source portal and application destination separate so the system can support review, statistics, and future application automation.

## 2. Actors

| Actor | Description |
| --- | --- |
| Job seeker | Receives WhatsApp alerts and reviews matching offers. |
| Offer storage service | Persists accepted offers and notification state. |
| Notification service | Prepares and sends WhatsApp messages for accepted offers. |
| WhatsApp messaging provider | External service used to deliver messages to the user's personal phone. |
| System | Coordinates storage, deduplication, and delivery status. |

## 3. Functional Requirements

| ID | Description | Priority | Traces to (REQ-xxx) |
| --- | --- | --- | --- |
| FR-007 | The system shall persist every accepted offer with the required offer fields. | Must | REQ-004, REQ-005 |
| FR-008 | The system shall store source portal and application destination as separate values. | Must | REQ-005, REQ-006 |
| FR-009 | The system shall allow application destination to be unknown when it cannot be confirmed. | Should | REQ-006 |
| FR-010 | The system shall create a WhatsApp notification candidate for each new accepted offer. | Must | REQ-007 |
| FR-011 | The system shall include enough offer information in each WhatsApp message for user triage. | Should | REQ-008 |
| FR-012 | The system shall record notification delivery status for each notification attempt. | Should | REQ-007 |

## 4. Workflow

1. The collection and filtering feature provides an accepted offer.
2. The system checks whether the accepted offer already exists.
3. The system stores the offer with company name, job description, source portal, application destination, and filter metadata.
4. The system creates a notification candidate for a newly stored accepted offer.
5. The notification service formats a WhatsApp message with key offer information.
6. The messaging provider attempts delivery to the configured personal phone number.
7. The system records notification status and any provider response needed for retry or audit.

## 5. Inputs

| Input | Source |
| --- | --- |
| Accepted offer | Offer collection and filtering feature |
| Company name | Normalized offer data |
| Job description | Normalized offer data |
| Source portal | Portal connector metadata |
| Application destination | Portal connector or redirect detection |
| Personal phone destination | Notification configuration |
| Provider response | WhatsApp messaging provider |

## 6. Outputs

| Output | Destination |
| --- | --- |
| Stored accepted offer | Database |
| Notification candidate | Notification service |
| WhatsApp message | User's personal phone |
| Notification delivery status | Database and backend API |

## 7. Acceptance Criteria

Each criterion verifies exactly one Functional Requirement.

| ID | Given | When | Then | Verifies |
| --- | --- | --- | --- | --- |
| AC-007 | an offer has passed the configured filters | the storage workflow runs | the system persists the offer with required fields | FR-007 |
| AC-008 | an offer is found in LinkedIn but redirects to a company page | the offer is stored | the source portal remains LinkedIn and the application destination stores the company page when available | FR-008 |
| AC-009 | an application destination cannot be confirmed | the offer is stored | the system records an unknown destination without failing the accepted offer | FR-009 |
| AC-010 | a newly accepted offer is stored | notification preparation runs | the system creates a WhatsApp notification candidate | FR-010 |
| AC-011 | a notification candidate exists | the WhatsApp message is composed | the message includes company name, role or description summary, source portal, and application link or destination when available | FR-011 |
| AC-012 | the messaging provider responds to a send attempt | the notification workflow completes | the system stores the delivery status for that attempt | FR-012 |

## 8. Error Handling

- If database persistence fails, the offer is not sent as a successful notification and the failure is recorded for retry.
- If the WhatsApp provider rejects a message, the system records the rejection reason when provided.
- If the user's phone destination is not configured, the system stores offers but marks notification attempts as blocked.
- If an accepted offer already exists, the system avoids duplicate notification unless the offer has materially changed and the product configuration allows re-alerting.

## 9. Interface Requirements

| ID | Interface | Description | Traces to (REQ-xxx) |
| --- | --- | --- | --- |
| INT-003 | Offer persistence contract | Stores accepted offers, source portal, application destination, and notification state in the database. | REQ-004, REQ-005 |
| INT-004 | WhatsApp provider contract | Sends formatted notification messages and returns delivery or failure status. | REQ-007, REQ-008 |

## References

- App Busqueda Empleo Business Requirements Document
- IEEE 29148 Requirements Engineering
