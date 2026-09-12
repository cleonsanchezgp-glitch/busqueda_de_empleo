import fs from "node:fs/promises";

const API = "https://api.github.com";
const API_VERSION = "2026-03-10";
const owner = "cleonsanchezgp-glitch";
const repo = "busqueda_de_empleo";
const projectNumber = 3;
const projectBase = `${API}/users/${owner}/projectsV2/${projectNumber}`;
const receiptPath = new URL("./github-planning-sync-project3-receipt.json", import.meta.url);

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error("GH_TOKEN or GITHUB_TOKEN is required");

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": API_VERSION,
  Authorization: `Bearer ${token}`,
};

const labels = [
  ["qualitas:planning", "0e7490", "Qualitas-managed Planning and Time item"],
  ["work:initiative", "5319e7", "Qualitas Initiative"],
  ["work:project", "1d76db", "Qualitas Project"],
  ["work:work-package", "fbca04", "Qualitas Work Package"],
  ["work:task", "ededed", "Qualitas Task"],
  ["domain:product", "0e8a16", "Product-level planning"],
  ["domain:collection", "0052cc", "Offer collection and filtering"],
  ["domain:storage", "bfdadc", "Offer storage and notifications"],
  ["domain:statistics", "c2e0c6", "Backend statistics and frontend dashboard"],
];

const fieldPlan = [
  { name: "Canonical ID", data_type: "text" },
  {
    name: "Domain",
    data_type: "single_select",
    single_select_options: [
      { name: "Product", color: "BLUE", description: "Product-level planning" },
      { name: "Collection", color: "GREEN", description: "Collection and filtering work" },
      { name: "Storage", color: "PURPLE", description: "Offer storage and notification work" },
      { name: "Statistics", color: "YELLOW", description: "API and dashboard work" },
    ],
  },
  {
    name: "Horizon",
    data_type: "single_select",
    single_select_options: [
      { name: "H2 2026", color: "BLUE", description: "Initial delivery horizon; dates remain TBD" },
      { name: "Future", color: "GRAY", description: "Post-MVP work" },
    ],
  },
  {
    name: "Priority",
    data_type: "single_select",
    single_select_options: [
      { name: "Must", color: "RED", description: "Required for initial value" },
      { name: "Should", color: "YELLOW", description: "Important but negotiable" },
      { name: "Could", color: "GRAY", description: "Optional improvement" },
    ],
  },
  {
    name: "Urgency",
    data_type: "single_select",
    single_select_options: [
      { name: "Now", color: "RED", description: "Start in the initial delivery flow" },
      { name: "Next", color: "YELLOW", description: "Follow after foundations are ready" },
      { name: "Later", color: "GRAY", description: "Defer until the MVP foundation is stable" },
    ],
  },
  { name: "Specification", data_type: "text" },
  {
    name: "PRJ",
    data_type: "single_select",
    single_select_options: [
      { name: "PRJ-001", color: "BLUE", description: "Initial job-search assistant MVP" },
    ],
  },
];

const workItems = [
  {
    id: "INI-001",
    type: "Initiative",
    title: "App Busqueda Empleo MVP",
    domain: "Product",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "OBJ-001; OBJ-002; OBJ-003; OBJ-004; OBJ-005; OBJ-006",
    labels: ["qualitas:planning", "work:initiative", "domain:product"],
    overview: [
      "Strategic effort to deliver a personal job-search assistant for junior software developer roles in Zaragoza.",
      "Test infrastructure is treated as standard product engineering work for this plan because no dedicated test-platform, environment, or separate procurement timeline is described in the current Specification or ADD.",
    ],
  },
  {
    id: "PRJ-001",
    type: "Project",
    parent: "INI-001",
    lineage: "PRJ-001",
    title: "Initial job-search assistant MVP",
    domain: "Product",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "OBJ-001; OBJ-002; OBJ-003; OBJ-004; OBJ-005; OBJ-006",
    labels: ["qualitas:planning", "work:project", "domain:product"],
    overview: [
      "Deliver the first usable product slice: portal collection, filtering, accepted-offer storage, WhatsApp notification preparation, backend statistics, and frontend statistics display.",
      "Targets MS-001: MVP operational. No committed target date is set because capacity and delivery dates were not present in the source documents.",
    ],
  },
  {
    id: "WP-001",
    type: "Work Package",
    parent: "PRJ-001",
    lineage: "PRJ-001",
    title: "Offer collection and filtering",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-001; FR-002; FR-003; FR-004; FR-005; FR-006; NFR-003; NFR-004; NFR-010; NFR-017; NFR-019; NFR-020; NFR-022; NFR-023",
    labels: ["qualitas:planning", "work:work-package", "domain:collection"],
    overview: ["Implements collection runs, connector boundaries, normalization, filtering, duplicate detection, classification, and portal run status."],
  },
  {
    id: "TSK-001",
    type: "Task",
    parent: "WP-001",
    lineage: "PRJ-001",
    title: "Define connector contract and supported portal configuration",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-001; NFR-003; NFR-004; NFR-020; NFR-022",
    labels: ["qualitas:planning", "work:task", "domain:collection"],
    overview: ["Create the shared connector boundary and configuration shape for LinkedIn, InfoJobs, and Tecnoempleo, including rate-limit and disabled-portal behavior."],
  },
  {
    id: "TSK-002",
    type: "Task",
    parent: "WP-001",
    lineage: "PRJ-001",
    title: "Implement initial portal connector execution flow",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-001; FR-006; NFR-010; NFR-022",
    labels: ["qualitas:planning", "work:task", "domain:collection"],
    overview: ["Run each configured connector through permitted access paths, continue when one portal fails, and record per-portal status."],
  },
  {
    id: "TSK-003",
    type: "Task",
    parent: "WP-001",
    lineage: "PRJ-001",
    title: "Normalize raw offers into the internal offer model",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-002; NFR-018",
    labels: ["qualitas:planning", "work:task", "domain:collection"],
    overview: ["Map portal-specific data into stable offer identity, company, description, source portal, destination, location, modality, seniority, and timestamp fields."],
  },
  {
    id: "TSK-004",
    type: "Task",
    parent: "WP-001",
    lineage: "PRJ-001",
    title: "Apply configurable search-profile filtering",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-003; NFR-019",
    labels: ["qualitas:planning", "work:task", "domain:collection"],
    overview: ["Evaluate seniority, role, on-site modality, and Zaragoza location from configuration rather than hardcoded values."],
  },
  {
    id: "TSK-005",
    type: "Task",
    parent: "WP-001",
    lineage: "PRJ-001",
    title: "Store classification and filter reasoning",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-004; NFR-017; NFR-023",
    labels: ["qualitas:planning", "work:task", "domain:collection"],
    overview: ["Classify offers as accepted, rejected, or review-needed and keep enough reasoning for later inspection."],
  },
  {
    id: "TSK-006",
    type: "Task",
    parent: "WP-001",
    lineage: "PRJ-001",
    title: "Detect likely duplicates across collected offers",
    domain: "Collection",
    horizon: "H2 2026",
    priority: "Should",
    urgency: "Next",
    specification: "FR-005",
    labels: ["qualitas:planning", "work:task", "domain:collection"],
    overview: ["Mark likely duplicates using stable offer signals while preserving uncertain cases for review."],
  },
  {
    id: "WP-002",
    type: "Work Package",
    parent: "PRJ-001",
    lineage: "PRJ-001",
    title: "Offer storage and WhatsApp notifications",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-007; FR-008; FR-009; FR-010; FR-011; FR-012; NFR-001; NFR-005; NFR-007; NFR-011; NFR-012; NFR-013; NFR-015; NFR-021; NFR-024",
    labels: ["qualitas:planning", "work:work-package", "domain:storage"],
    overview: ["Implements accepted-offer persistence, source/destination separation, notification candidates, WhatsApp provider boundary, and delivery state."],
  },
  {
    id: "TSK-007",
    type: "Task",
    parent: "WP-002",
    lineage: "PRJ-001",
    title: "Create accepted-offer persistence model",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-007; FR-008; FR-009; NFR-011; NFR-015",
    labels: ["qualitas:planning", "work:task", "domain:storage"],
    overview: ["Persist accepted offers with required fields and preserve source portal and application destination as distinct values, including unknown destinations."],
  },
  {
    id: "TSK-008",
    type: "Task",
    parent: "WP-002",
    lineage: "PRJ-001",
    title: "Prevent duplicate storage and duplicate alerts",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Should",
    urgency: "Next",
    specification: "FR-007; FR-010; NFR-011; NFR-015",
    labels: ["qualitas:planning", "work:task", "domain:storage"],
    overview: ["Check existing accepted offers before storing or notifying so repeated connector results do not create accidental repeated alerts."],
  },
  {
    id: "TSK-009",
    type: "Task",
    parent: "WP-002",
    lineage: "PRJ-001",
    title: "Create notification candidates for newly accepted offers",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-010; NFR-001",
    labels: ["qualitas:planning", "work:task", "domain:storage"],
    overview: ["Queue eligible notifications shortly after accepted offers are stored."],
  },
  {
    id: "TSK-010",
    type: "Task",
    parent: "WP-002",
    lineage: "PRJ-001",
    title: "Implement WhatsApp provider adapter boundary",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-011; FR-012; NFR-005; NFR-007; NFR-012; NFR-021",
    labels: ["qualitas:planning", "work:task", "domain:storage"],
    overview: ["Format triage-friendly messages and isolate provider credentials, send calls, delivery responses, failures, and replacement behavior."],
  },
  {
    id: "TSK-011",
    type: "Task",
    parent: "WP-002",
    lineage: "PRJ-001",
    title: "Protect sensitive notification and offer configuration",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "NFR-013; NFR-024",
    labels: ["qualitas:planning", "work:task", "domain:storage"],
    overview: ["Load phone numbers and provider credentials from protected runtime configuration and keep automatic application behavior disabled."],
  },
  {
    id: "TSK-012",
    type: "Task",
    parent: "WP-002",
    lineage: "PRJ-001",
    title: "Expose notification state for retry and inspection",
    domain: "Storage",
    horizon: "H2 2026",
    priority: "Should",
    urgency: "Next",
    specification: "FR-012; NFR-012",
    labels: ["qualitas:planning", "work:task", "domain:storage"],
    overview: ["Retain provider response metadata and blocked/failed states so delivery problems are recoverable."],
  },
  {
    id: "WP-003",
    type: "Work Package",
    parent: "PRJ-001",
    lineage: "PRJ-001",
    title: "Backend statistics and frontend dashboard",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-013; FR-014; FR-015; FR-016; FR-017; FR-018; NFR-002; NFR-006; NFR-008; NFR-009; NFR-014; NFR-016; NFR-018",
    labels: ["qualitas:planning", "work:work-package", "domain:statistics"],
    overview: ["Implements internal offer/statistics APIs, aggregation by source and destination, frontend statistics display, and empty/error/unknown states."],
  },
  {
    id: "TSK-013",
    type: "Task",
    parent: "WP-003",
    lineage: "PRJ-001",
    title: "Design internal offer and statistics API responses",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-013; FR-014; NFR-006; NFR-018",
    labels: ["qualitas:planning", "work:task", "domain:statistics"],
    overview: ["Define stable backend response shapes for accepted offers, source portal counts, application destination counts, totals, and future automation metadata."],
  },
  {
    id: "TSK-014",
    type: "Task",
    parent: "WP-003",
    lineage: "PRJ-001",
    title: "Implement aggregation by source portal and application destination",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-014; FR-017; NFR-002; NFR-009",
    labels: ["qualitas:planning", "work:task", "domain:statistics"],
    overview: ["Aggregate stored accepted offers quickly and treat unknown application destinations as a visible category."],
  },
  {
    id: "TSK-015",
    type: "Task",
    parent: "WP-003",
    lineage: "PRJ-001",
    title: "Build frontend statistics views",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "FR-015; FR-016; FR-017; NFR-008; NFR-009",
    labels: ["qualitas:planning", "work:task", "domain:statistics"],
    overview: ["Display source portal and application destination statistics distinctly, including empty, failed, and unknown states."],
  },
  {
    id: "TSK-016",
    type: "Task",
    parent: "WP-003",
    lineage: "PRJ-001",
    title: "Add access control boundary before non-local exposure",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Must",
    urgency: "Now",
    specification: "NFR-014",
    labels: ["qualitas:planning", "work:task", "domain:statistics"],
    overview: ["Ensure stored offer data is not exposed publicly without the intended local or authenticated access control."],
  },
  {
    id: "TSK-017",
    type: "Task",
    parent: "WP-003",
    lineage: "PRJ-001",
    title: "Add modular tests for API and dashboard behavior",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Should",
    urgency: "Next",
    specification: "NFR-016; AC-020; AC-024; AC-026; AC-027",
    labels: ["qualitas:planning", "work:task", "domain:statistics"],
    overview: ["Cover API contracts, aggregation results, frontend rendering, empty data, API failures, and unknown destinations with focused tests."],
  },
  {
    id: "TSK-018",
    type: "Task",
    parent: "WP-003",
    lineage: "PRJ-001",
    title: "Preserve automation-ready offer data through the API",
    domain: "Statistics",
    horizon: "H2 2026",
    priority: "Should",
    urgency: "Next",
    specification: "FR-018; NFR-018",
    labels: ["qualitas:planning", "work:task", "domain:statistics"],
    overview: ["Ensure source, destination, identity, company, description, and collection metadata remain available for future semi-automatic application analysis."],
  },
];

async function main() {
  const receipt = await readReceipt();
  await saveReceipt({ ...receipt, started_at: new Date().toISOString(), project: { owner, repo, project_number: projectNumber }, planned_items: workItems.length });

  const project = await getJson(`${projectBase}`);
  if (project.number !== projectNumber || project.owner?.login?.toLowerCase() !== owner) {
    throw new Error("Project identity mismatch");
  }

  const repoInfo = await getJson(`${API}/repos/${owner}/${repo}`);
  if (!repoInfo.permissions?.push && !repoInfo.permissions?.maintain && !repoInfo.permissions?.admin) {
    throw new Error("Token does not have write permission to the repository");
  }

  await ensureLabels();
  const fields = await ensureFields();
  const statusTodo = optionId(fields.get("Status"), "Todo");
  const existingIssues = await listExistingPlanningIssues();
  const existingItems = await listProjectItems();
  const issueById = new Map(existingIssues.map((issue) => [canonicalFromBody(issue.body), issue]).filter(([id]) => id));
  const itemByIssueId = new Map(existingItems.filter((item) => item.content?.id).map((item) => [item.content.id, item]));

  const issues = new Map();
  const itemIds = new Map();

  for (const item of workItems) {
    let issue = issueById.get(item.id);
    if (!issue) {
      await record(receipt, "intent", item.id, { action: "create_issue" });
      issue = await createIssue(item);
      await record(receipt, "created", item.id, { action: "create_issue", issue_number: issue.number, issue_id: issue.id, html_url: issue.html_url });
    }
    issues.set(item.id, issue);

    let projectItem = itemByIssueId.get(issue.id);
    if (!projectItem) {
      await record(receipt, "intent", item.id, { action: "add_project_item", issue_number: issue.number, issue_id: issue.id });
      const added = await postJson(`${projectBase}/items`, { type: "Issue", id: issue.id });
      projectItem = added.value ?? added;
      await record(receipt, "created", item.id, { action: "add_project_item", issue_number: issue.number, issue_id: issue.id, project_item_id: projectItem.id, html_url: issue.html_url });
    }
    itemIds.set(item.id, projectItem.id);

    await updateProjectFields(projectItem.id, item, fields, statusTodo);
  }

  for (const item of workItems.filter((entry) => entry.parent)) {
    const parent = issues.get(item.parent);
    const child = issues.get(item.id);
    await ensureSubIssue(parent, child, receipt, item.id);
  }

  const finalItems = await listProjectItems();
  await saveReceipt({
    ...receipt,
    completed_at: new Date().toISOString(),
    result: {
      project_url: `https://github.com/users/${owner}/projects/${projectNumber}`,
      issue_count: issues.size,
      project_item_count: finalItems.length,
      created_or_reused: Array.from(issues.values()).map((issue) => ({ number: issue.number, title: issue.title, url: issue.html_url })),
    },
  });

  console.log(JSON.stringify({
    ok: true,
    project: `https://github.com/users/${owner}/projects/${projectNumber}`,
    issues: Array.from(issues.values()).map((issue) => ({ number: issue.number, title: issue.title, url: issue.html_url })),
    project_items: finalItems.length,
    receipt: String(receiptPath.pathname),
  }, null, 2));
}

async function ensureLabels() {
  for (const [name, color, description] of labels) {
    const encoded = encodeURIComponent(name);
    const current = await request(`${API}/repos/${owner}/${repo}/labels/${encoded}`, { allowed: [200, 404] });
    if (current.status === 404) {
      await postJson(`${API}/repos/${owner}/${repo}/labels`, { name, color, description });
    }
  }
}

async function ensureFields() {
  const fields = new Map((await getJson(`${projectBase}/fields?per_page=100`)).map((field) => [field.name, field]));
  for (const desired of fieldPlan) {
    if (!fields.has(desired.name)) {
      const created = await postJson(`${projectBase}/fields`, desired);
      fields.set(created.name, created);
      continue;
    }

    const existing = fields.get(desired.name);
    if (desired.data_type !== existing.data_type) {
      throw new Error(`Field ${desired.name} has type ${existing.data_type}, expected ${desired.data_type}`);
    }

    if (desired.data_type === "single_select") {
      const existingOptions = new Set((existing.options ?? []).map((option) => option.name?.raw));
      const missing = desired.single_select_options.filter((option) => !existingOptions.has(option.name));
      if (missing.length) throw new Error(`Field ${desired.name} is missing options: ${missing.map((option) => option.name).join(", ")}`);
    }
  }
  return new Map((await getJson(`${projectBase}/fields?per_page=100`)).map((field) => [field.name, field]));
}

async function listExistingPlanningIssues() {
  const issues = [];
  let url = `${API}/repos/${owner}/${repo}/issues?state=all&labels=${encodeURIComponent("qualitas:planning")}&per_page=100`;
  while (url) {
    const { data, response } = await request(url);
    issues.push(...data.filter((issue) => !issue.pull_request));
    url = nextLink(response);
  }
  return issues;
}

async function listProjectItems() {
  const items = [];
  let url = `${projectBase}/items?per_page=100`;
  while (url) {
    const { data, response } = await request(url);
    items.push(...data);
    url = nextLink(response);
  }
  return items;
}

async function createIssue(item) {
  return postJson(`${API}/repos/${owner}/${repo}/issues`, {
    title: `[${item.id}] ${item.title}`,
    body: bodyFor(item),
    labels: item.labels,
  });
}

async function updateProjectFields(projectItemId, item, fields, statusTodo) {
  const updates = [
    { id: fields.get("Canonical ID").id, value: item.id },
    { id: fields.get("Domain").id, value: optionId(fields.get("Domain"), item.domain) },
    { id: fields.get("Horizon").id, value: optionId(fields.get("Horizon"), item.horizon) },
    { id: fields.get("Priority").id, value: optionId(fields.get("Priority"), item.priority) },
    { id: fields.get("Urgency").id, value: optionId(fields.get("Urgency"), item.urgency) },
    { id: fields.get("Specification").id, value: item.specification },
    { id: fields.get("Status").id, value: statusTodo },
  ];
  if (item.lineage) updates.push({ id: fields.get("PRJ").id, value: optionId(fields.get("PRJ"), item.lineage) });
  await patchJson(`${projectBase}/items/${projectItemId}`, { fields: updates });
}

async function ensureSubIssue(parent, child, receipt, canonicalId) {
  const children = await getJson(`${API}/repos/${owner}/${repo}/issues/${parent.number}/sub_issues?per_page=100`);
  if (children.some((issue) => issue.id === child.id || issue.number === child.number)) return;
  await record(receipt, "intent", canonicalId, { action: "add_sub_issue", parent: parent.number, child: child.number });
  await postJson(`${API}/repos/${owner}/${repo}/issues/${parent.number}/sub_issues`, { sub_issue_id: child.id });
  await record(receipt, "created", canonicalId, { action: "add_sub_issue", parent: parent.number, child: child.number });
}

function bodyFor(item) {
  return [
    "<!-- qualitas:planning -->",
    `Canonical ID: ${item.id}`,
    `Entity: ${item.type}`,
    item.parent ? `Parent: ${item.parent}` : null,
    item.lineage ? `Project: ${item.lineage}` : null,
    `Domain: ${item.domain}`,
    `Horizon: ${item.horizon}`,
    `Priority: ${item.priority}`,
    `Urgency: ${item.urgency}`,
    `Specification: ${item.specification}`,
    "Status: Todo",
    "",
    "## Overview",
    ...item.overview.map((line) => `- ${line}`),
    "",
    "## Traceability",
    `- Source VSD/BRD/FRD/NFRD/ADD reviewed locally by Rector on 2026-09-12.`,
    `- Managed by Qualitas Rector in GitHub Project ${projectNumber}.`,
  ].filter(Boolean).join("\n");
}

function canonicalFromBody(body = "") {
  return body.match(/^Canonical ID:\s*([A-Z]+-\d+)/m)?.[1] ?? null;
}

function optionId(field, name) {
  const option = field?.options?.find((entry) => entry.name?.raw === name);
  if (!option) throw new Error(`Missing option ${name} on field ${field?.name ?? "unknown"}`);
  return option.id;
}

async function getJson(url) {
  return (await request(url)).data;
}

async function postJson(url, body) {
  return (await request(url, { method: "POST", body, allowed: [200, 201] })).data;
}

async function patchJson(url, body) {
  return (await request(url, { method: "PATCH", body, allowed: [200] })).data;
}

async function request(url, { method = "GET", body, allowed = [200] } = {}) {
  const parsed = new URL(url);
  if (parsed.origin !== API) throw new Error(`Refusing non-GitHub API URL: ${url}`);
  const response = await fetch(url, {
    method,
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
    headers: { ...headers, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!allowed.includes(response.status)) {
    throw new Error(`${method} ${url} failed with ${response.status}: ${JSON.stringify(data)}`);
  }
  return { data, response, status: response.status };
}

function nextLink(response) {
  const link = response.headers.get("link") ?? "";
  const next = link.split(",").find((part) => /rel="next"/.test(part))?.match(/<([^>]+)>/)?.[1] ?? null;
  if (!next) return null;
  const parsed = new URL(next);
  if (parsed.origin !== API) throw new Error(`Unsafe pagination URL: ${next}`);
  return next;
}

async function readReceipt() {
  try {
    return JSON.parse(await fs.readFile(receiptPath, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { version: 1, operations: {} };
    throw error;
  }
}

async function saveReceipt(receipt) {
  await fs.writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`);
}

async function record(receipt, state, canonicalId, data) {
  receipt.operations[canonicalId] = [
    ...(receipt.operations[canonicalId] ?? []),
    { state, at: new Date().toISOString(), ...data },
  ];
  await saveReceipt(receipt);
}

await main();
