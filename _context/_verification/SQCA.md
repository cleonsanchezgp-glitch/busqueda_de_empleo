# App Busqueda Empleo - Software Quality Characteristics Analysis

## Title

| Field | Value |
| --- | --- |
| Document | Software Quality Characteristics Analysis (SQCA) |
| Initiative | App Busqueda Empleo |
| Version | 0.1 |
| Status | Draft - for review |
| Author | Quaestor |
| Reviewers | Aelium |
| Organization | Aelium |
| Last Updated | 2026-09-12 |

## 1. Purpose

This analysis prioritizes ISO/IEC 25010:2023 quality subcharacteristics for App Busqueda Empleo so the Test Management Plan can choose depth of testing explicitly. The product handles personal job-search data, external portal access, WhatsApp notifications, backend statistics, and a frontend dashboard; those risks drive the priorities below.

## 2. Priority Scale

| Priority | Meaning |
| --- | --- |
| High | Material risk if this characteristic fails. Drives dedicated unit, integration, system, and regression coverage where relevant. |
| Medium | Real but bounded risk. Drives representative coverage and targeted integration/system checks. |
| Low | Limited exposure. Covered through smoke checks, review, or incidental regression coverage. |
| N/A | Not applicable to the current product context. |

## 3. Characteristic Assessment

### 3.1 Functional Suitability

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Functional completeness | High | The MVP value depends on all core flows existing: collect, filter, store, notify, aggregate, and display. | Requirements coverage, system workflow tests, acceptance scenarios |
| Functional correctness | High | Incorrect filtering or statistics would notify irrelevant offers or hide useful ones, directly harming the product purpose. | Unit tests, integration tests, decision-table tests, E2E checks |
| Functional appropriateness | High | The system must reduce manual portal checking rather than merely reproduce noisy search results. | Scenario tests, acceptance tests, exploratory review |

### 3.2 Performance Efficiency

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Time behaviour | High | The VSD and NFRD require matching offers to be notification-eligible within 15 minutes and statistics API responses under 2 seconds. | Timing checks, API performance tests, queue latency tests |
| Resource utilization | Medium | Collection must avoid unnecessary load on external portals and local resources, but the initial dataset is personal-scale. | Rate-limit tests, scheduler/backoff tests, resource smoke checks |
| Capacity | Low | No multi-user or large-volume scope is defined for the first release. | Dataset smoke tests, growth-risk review |

### 3.3 Compatibility

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Co-existence | Low | The product is personal-use and no co-hosted platform constraints are specified yet. | Deployment smoke checks |
| Interoperability | High | The product depends on portal connector boundaries, WhatsApp provider behavior, and frontend/backend API contracts. | Contract tests, integration tests, provider mock tests |

### 3.4 Interaction Capability

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Appropriateness recognisability | Medium | The user must recognize source portal versus application destination in notifications and statistics. | UI acceptance tests, content review |
| Learnability | Low | The first release is for a single primary user and has a narrow dashboard workflow. | Exploratory smoke review |
| Operability | Medium | The user must inspect statistics, empty states, failures, and unknown destinations without database access. | UI workflow tests, error-state checks |
| User error protection | Low | No destructive user input or multi-user editing flow is in initial scope. | Basic form/input smoke checks if configuration UI appears |
| User engagement | Low | Engagement quality is not a stated business driver beyond utility and clarity. | Exploratory review |
| Inclusivity | Low | No explicit accessibility audience requirement is stated; basic web accessibility remains a good implementation concern. | Accessibility smoke checks |
| User assistance | Low | Help/onboarding is not in scope for the initial personal-use release. | Content review if assistance is added |
| Self-descriptiveness | Medium | Empty, failed, unknown, source, and destination states must be understandable in the frontend. | UI state tests, acceptance review |

### 3.5 Reliability

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Faultlessness | High | Incorrect storage, notification, or aggregation can lose opportunities or produce misleading analysis. | Unit, integration, regression, data-integrity tests |
| Availability | Medium | The product supports daily personal use, but no public SLA is defined. | Scheduled-run smoke checks, service health checks |
| Fault tolerance | High | Failure in one portal connector must not stop other connectors, and restricted access must fail safely. | Failure-injection tests, connector integration tests |
| Recoverability | High | Failed notifications and persistence issues must retain enough state for retry or manual follow-up. | Retry-state tests, persistence failure tests |

### 3.6 Security

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Confidentiality | High | Phone numbers, credentials, job-search metadata, descriptions, and application links reveal personal employment activity. | Secret scanning, access-control tests, configuration review |
| Integrity | High | Source portal, destination, offer identity, and classification data must not be silently overwritten. | Data-integrity tests, update-path tests |
| Non-repudiation | Low | Formal proof of user actions is not needed in the first release. | Auditability review only if workflows expand |
| Accountability | Medium | Connector run status, filter reasoning, and notification delivery state need enough attribution for troubleshooting. | Logging/state tests, operational review |
| Authenticity | Medium | Provider credentials and backend access must be genuine, but full multi-user authentication is out of scope. | Credential boundary tests, access smoke checks |
| Resistance | High | The system must not bypass portal restrictions and must protect exposed backend endpoints before non-local deployment. | Security tests, restricted-access tests, dependency/configuration review |

### 3.7 Maintainability

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Modularity | High | The ADD explicitly separates collection, filtering, storage, notification, API, frontend, and configuration responsibilities. | Unit tests by component, contract tests |
| Reusability | Medium | Connector and notification adapter contracts should support future portals/providers. | Adapter contract tests, design review |
| Analysability | High | Filter decisions and connector/notification states must be inspectable for review and future automation. | Metadata tests, log/state review |
| Modifiability | Medium | Search profile, portal enablement, and provider replacement must change without broad rewrites. | Configuration tests, regression tests |
| Testability | High | The strategy expects unit, integration, system, and acceptance evidence for risk-significant paths. | Test harness review, automated regression coverage |

### 3.8 Flexibility

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Adaptability | Medium | The search profile and target portals may change after the first release. | Configuration tests, scenario tests |
| Scalability | Low | Personal-use scale is explicit; broader scale is future scope. | Dataset smoke checks |
| Installability | Low | Deployment choices are still TBD and no installation target is specified. | Local/staging setup smoke checks once stack is chosen |
| Replaceability | Medium | Portal connectors and WhatsApp provider adapter are explicitly replaceable boundaries. | Adapter swap tests, contract tests |

### 3.9 Safety

| Subcharacteristic | Priority | Rationale | Derived test types |
| --- | --- | --- | --- |
| Operational constraint | High | External portal access must respect APIs, permissions, robots guidance, rate limits, and terms of service. | Restricted-access tests, scheduler/backoff tests |
| Risk identification | Medium | Review-needed classification and visible unknown/failed states reduce misleading outputs. | Classification tests, UI state tests |
| Fail safe | High | Disallowed portal access, uncertain offers, failed storage, and notification failures must stop or degrade safely. | Failure-injection tests, negative tests |
| Hazard warning | Medium | User-facing failed/unknown states are needed so the user does not overtrust incomplete data. | UI warning/state tests |
| Safe integration | High | Portal connectors and WhatsApp notification are external integrations with compliance and privacy implications. | Integration contract tests, provider mock tests, configuration review |

## 4. Summary - High Priority Only

| Characteristic | Subcharacteristic | Rationale | Derived test types |
| --- | --- | --- | --- |
| Functional Suitability | Functional completeness | MVP value depends on collect, filter, store, notify, aggregate, and display all working. | Requirements coverage, system workflow tests, acceptance scenarios |
| Functional Suitability | Functional correctness | Filtering and statistics errors directly harm job-search usefulness. | Unit tests, integration tests, decision-table tests, E2E checks |
| Functional Suitability | Functional appropriateness | The system must reduce manual search noise. | Scenario tests, acceptance tests, exploratory review |
| Performance Efficiency | Time behaviour | Notification and API timing targets are explicit. | Timing checks, API performance tests, queue latency tests |
| Compatibility | Interoperability | The product depends on portal, WhatsApp, and frontend/backend boundaries. | Contract tests, integration tests, provider mock tests |
| Reliability | Faultlessness | Storage, notification, and aggregation defects can lose or misrepresent opportunities. | Unit, integration, regression, data-integrity tests |
| Reliability | Fault tolerance | One connector failure or disallowed access must not break the whole cycle. | Failure-injection tests, connector integration tests |
| Reliability | Recoverability | Failed notifications and persistence issues must remain recoverable. | Retry-state tests, persistence failure tests |
| Security | Confidentiality | Stored and transmitted data exposes personal employment activity. | Secret scanning, access-control tests, configuration review |
| Security | Integrity | Offer identity, source, destination, and classification must be protected from silent corruption. | Data-integrity tests, update-path tests |
| Security | Resistance | Backend exposure and portal restrictions carry security/compliance risk. | Security tests, restricted-access tests, dependency/configuration review |
| Maintainability | Modularity | ADD separates core responsibilities and expects independent testing. | Unit tests by component, contract tests |
| Maintainability | Analysability | Filter reasoning and run/delivery state must be inspectable. | Metadata tests, log/state review |
| Maintainability | Testability | The organization strategy requires evidence proportionate to risk. | Test harness review, automated regression coverage |
| Safety | Operational constraint | Portal access rules must be respected. | Restricted-access tests, scheduler/backoff tests |
| Safety | Fail safe | Restricted access, uncertain offers, storage failure, and delivery failure need safe outcomes. | Failure-injection tests, negative tests |
| Safety | Safe integration | External portals and WhatsApp have compliance and privacy implications. | Integration contract tests, provider mock tests, configuration review |

## References

- App Busqueda Empleo Vision and Scope Document
- App Busqueda Empleo Business Requirements Document
- Offer Collection and Filtering FRD
- Offer Storage and WhatsApp Notifications FRD
- Backend Statistics and Frontend Dashboard FRD
- App Busqueda Empleo Non-Functional Requirements Document
- App Busqueda Empleo Architecture Design Document
- Aelium Organizational Test Policy
- Aelium Organizational Test Strategy
- ISO/IEC 29119-2:2021 Section 7.1
- ISO/IEC 25010:2023 Systems and Software Quality Models
