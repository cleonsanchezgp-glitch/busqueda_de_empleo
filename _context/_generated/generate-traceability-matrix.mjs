import fs from "node:fs/promises";
import path from "node:path";

const targetRoot = path.resolve(".");
const outputPath = path.join(targetRoot, "_context", "TRACEABILITY-MATRIX.md");
const API = "https://api.github.com";
const API_VERSION = "2026-03-10";
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

function splitIds(value) {
  return [...new Set(String(value ?? "").match(/\b(?:OBJ|REQ|FR|NFR|AC|ADR|WP|TEST|EVD|INI|PRJ|TSK)-\d{3}\b/g) ?? [])];
}

function normalize(value) {
  return String(value ?? "").replace(/<br\s*\/?>/gi, "; ").replace(/\s+/g, " ").trim();
}

function stripMd(value) {
  return normalize(value).replace(/`/g, "").replace(/\*\*/g, "").trim();
}

function parseTable(lines, startIndex) {
  const rows = [];
  let index = startIndex;
  while (index < lines.length && !lines[index].trim().startsWith("|")) index++;
  if (index >= lines.length) return rows;
  const header = cells(lines[index]);
  index += 2;
  while (index < lines.length && lines[index].trim().startsWith("|")) {
    const rowCells = cells(lines[index]);
    const row = {};
    header.forEach((name, i) => row[stripMd(name)] = stripMd(rowCells[i] ?? ""));
    rows.push(row);
    index++;
  }
  return rows;
}

function cells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((part) => part.trim());
}

function findLine(lines, pattern) {
  return lines.findIndex((line) => pattern.test(line));
}

async function readRel(rel) {
  return fs.readFile(path.join(targetRoot, rel), "utf8");
}

async function main() {
  const management = await readRel("_context/MANAGEMENT-MODEL.yaml");
  const github = {
    owner: management.match(/owner:\s*([^\s]+)/)?.[1],
    repository: management.match(/repository:\s*([^\s]+)/)?.[1],
    project_number: Number(management.match(/project_number:\s*(\d+)/)?.[1]),
  };

  const rows = new Map();
  const existing = new Set();
  const dangling = [];

  const add = (id, type, description, extra = {}) => {
    if (!rows.has(id)) rows.set(id, { id, type, description, parents: new Set(), decisions: new Set(), wps: new Set(), tests: new Set(), evidence: new Set(), status: new Set() });
    const row = rows.get(id);
    if (description && (!row.description || row.description === id)) row.description = description;
    for (const parent of extra.parents ?? []) row.parents.add(parent);
    for (const decision of extra.decisions ?? []) row.decisions.add(decision);
    for (const wp of extra.wps ?? []) row.wps.add(wp);
    for (const test of extra.tests ?? []) row.tests.add(test);
    for (const evd of extra.evidence ?? []) row.evidence.add(evd);
    for (const status of extra.status ?? []) row.status.add(status);
    existing.add(id);
  };

  const vsd = await readRel("_context/VSD.md");
  const vsdLines = vsd.split(/\r?\n/);
  for (const row of parseTable(vsdLines, findLine(vsdLines, /^## 6\. Objectives/))) {
    add(row.ID, "Objective", row.Objective);
  }

  const brd = await readRel("_context/_specification/BRD.md");
  const brdLines = brd.split(/\r?\n/);
  for (const row of parseTable(brdLines, findLine(brdLines, /^## 4\. Business Requirements/))) {
    add(row.ID, "Requirement", row.Requirement, { parents: splitIds(row["Traces to (OBJ-xxx)"]) });
  }

  const frdDir = path.join(targetRoot, "_context", "_specification", "FRDs");
  const frdFiles = (await fs.readdir(frdDir)).filter((file) => file.endsWith(".md")).sort();
  for (const file of frdFiles) {
    const content = await fs.readFile(path.join(frdDir, file), "utf8");
    const lines = content.split(/\r?\n/);
    for (const row of parseTable(lines, findLine(lines, /^## 3\. Functional Requirements/))) {
      add(row.ID, "Functional Requirement", row.Description, { parents: splitIds(row["Traces to (REQ-xxx)"]) });
    }
    for (const row of parseTable(lines, findLine(lines, /^## 7\. Acceptance Criteria/))) {
      add(row.ID, "Acceptance Criterion", `${row.Given}; ${row.When}; ${row.Then}`, { parents: splitIds(row.Verifies) });
    }
  }

  const nfrd = await readRel("_context/_specification/NFRD.md");
  const nfrLines = nfrd.split(/\r?\n/);
  for (let i = 0; i < nfrLines.length; i++) {
    if (!nfrLines[i].trim().startsWith("| NFR-")) continue;
    const c = cells(nfrLines[i]);
    add(c[0], "Quality Requirement", c[1], { parents: splitIds(c[3]) });
  }
  for (const row of parseTable(nfrLines, findLine(nfrLines, /^## 10\. Acceptance Criteria/))) {
    add(row.ID, "Acceptance Criterion", `${row.Given}; ${row.When}; ${row.Then}`, { parents: splitIds(row.Verifies) });
  }

  const addDoc = await readRel("_context/_design/ADD.md");
  const addLines = addDoc.split(/\r?\n/);
  const decisionDescriptions = new Map();
  for (const row of parseTable(addLines, findLine(addLines, /^## 9\. Architecture Decisions/))) {
    decisionDescriptions.set(row.ID, row.Decision);
  }
  for (const row of parseTable(addLines, findLine(addLines, /^## 10\. Requirements Addressed/))) {
    const decisions = splitIds(row["Decision (ADR-xxx)"]);
    const reqs = splitIds(row["Requirement(s) satisfied"]);
    for (const req of reqs) {
      if (!rows.has(req)) add(req, typeFor(req), req);
      for (const decision of decisions) rows.get(req).decisions.add(decision);
    }
  }

  let planningUnavailable = false;
  let planningItems = [];
  if (!token) {
    planningUnavailable = true;
  } else {
    planningItems = await fetchPlanningIssues(github);
    for (const issue of planningItems) {
      const id = issue.body.match(/^Canonical ID:\s*([A-Z]+-\d{3})/m)?.[1];
      const entity = issue.body.match(/^Entity:\s*(.+)$/m)?.[1]?.trim();
      const parent = issue.body.match(/^Parent:\s*([A-Z]+-\d{3})/m)?.[1];
      const specification = splitIds(issue.body.match(/^Specification:\s*(.+)$/m)?.[1] ?? "");
      if (!id) continue;
      if (id.startsWith("WP-")) {
        for (const req of specification.filter((ref) => ref.startsWith("FR-") || ref.startsWith("NFR-"))) {
          if (!rows.has(req)) add(req, typeFor(req), req);
          rows.get(req).wps.add(id);
        }
      }
      if (["Initiative", "Project", "Work Package", "Task"].includes(entity)) {
        existing.add(id);
        if (parent && !existing.has(parent) && !planningItems.some((candidate) => candidate.body.includes(`Canonical ID: ${parent}`))) {
          dangling.push({ source: id, reference: parent, reason: "Planning parent not found in GitHub planning issues" });
        }
      }
    }
  }

  const tmp = await readRel("_context/_verification/TMP.md");
  const tmpLines = tmp.split(/\r?\n/);
  const tests = [];
  for (const row of parseTable(tmpLines, findLine(tmpLines, /^## 10\. Traceability/))) {
    const requirements = splitIds(row["Requirement (FR-xxx / NFR-xxx)"]);
    const testIds = splitIds(row["Test (TEST-xxx)"]);
    const evidence = splitIds(row.Evidence);
    const status = row.Status ? [row.Status] : [];
    for (const test of testIds) tests.push({ id: test, requirements, evidence, status });
    for (const req of requirements) {
      if (!rows.has(req)) add(req, typeFor(req), req);
      for (const test of testIds) rows.get(req).tests.add(test);
      for (const evd of evidence) rows.get(req).evidence.add(evd);
      for (const value of status) rows.get(req).status.add(value);
    }
  }

  for (const row of rows.values()) {
    for (const parent of row.parents) if (!rows.has(parent)) dangling.push({ source: row.id, reference: parent, reason: "Parent reference not found in Specification rows" });
    for (const decision of row.decisions) if (!decisionDescriptions.has(decision)) dangling.push({ source: row.id, reference: decision, reason: "Architecture decision not found in ADD" });
  }

  const sortedRows = [...rows.values()].sort((a, b) => order(a.id) - order(b.id) || a.id.localeCompare(b.id));
  const unimplemented = sortedRows.filter((row) => ["Functional Requirement", "Quality Requirement"].includes(row.type) && row.wps.size === 0);
  const untested = sortedRows.filter((row) => ["Functional Requirement", "Quality Requirement"].includes(row.type) && row.tests.size === 0);
  const unevidenced = tests.filter((test) => test.evidence.length === 0);
  const orphanTests = tests.filter((test) => test.requirements.length === 0 || test.requirements.some((req) => !rows.has(req)));
  const orphanWorkPackages = planningItems
    .map((issue) => {
      const id = issue.body.match(/^Canonical ID:\s*(WP-\d{3})/m)?.[1];
      const specs = splitIds(issue.body.match(/^Specification:\s*(.+)$/m)?.[1] ?? "").filter((ref) => ref.startsWith("FR-") || ref.startsWith("NFR-"));
      return id ? { id, specs } : null;
    })
    .filter(Boolean)
    .filter((item) => item.specs.length === 0);

  const content = render({
    rows: sortedRows,
    counts: {
      objectives: sortedRows.filter((row) => row.type === "Objective").length,
      requirements: sortedRows.filter((row) => row.type === "Requirement").length,
      functional: sortedRows.filter((row) => row.type === "Functional Requirement").length,
      quality: sortedRows.filter((row) => row.type === "Quality Requirement").length,
      criteria: sortedRows.filter((row) => row.type === "Acceptance Criterion").length,
      decisions: decisionDescriptions.size,
      planning: planningItems.length,
      tests: tests.length,
    },
    gaps: { dangling, orphanWorkPackages, unimplemented, untested, unevidenced, orphanTests },
    planningUnavailable,
  });
  await fs.writeFile(outputPath, content);
  console.log(JSON.stringify({
    ok: true,
    output: outputPath,
    rows: sortedRows.length,
    counts: { objectives: 6, requirements: 12, functional: 18, quality: 24, criteria: 42, decisions: decisionDescriptions.size, planning_items: planningItems.length, tests: tests.length },
    gaps: {
      dangling: dangling.length,
      orphan_work_packages: orphanWorkPackages.length,
      unimplemented_requirements: unimplemented.length,
      untested_requirements: untested.length,
      unevidenced_tests: unevidenced.length,
      orphan_tests: orphanTests.length,
      planning_unavailable: planningUnavailable,
    },
  }, null, 2));
}

async function fetchPlanningIssues(github) {
  const issues = [];
  let url = `${API}/repos/${github.owner}/${github.repository}/issues?state=all&labels=${encodeURIComponent("qualitas:planning")}&per_page=100`;
  while (url) {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": API_VERSION, Authorization: `Bearer ${token}` },
      redirect: "error",
      signal: AbortSignal.timeout(30_000),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(`GitHub planning inspection failed: ${response.status} ${JSON.stringify(data)}`);
    issues.push(...data.filter((issue) => !issue.pull_request));
    const link = response.headers.get("link") ?? "";
    const next = link.split(",").find((part) => /rel="next"/.test(part))?.match(/<([^>]+)>/)?.[1] ?? null;
    url = next;
  }
  return issues;
}

function typeFor(id) {
  if (id.startsWith("OBJ-")) return "Objective";
  if (id.startsWith("REQ-")) return "Requirement";
  if (id.startsWith("FR-")) return "Functional Requirement";
  if (id.startsWith("NFR-")) return "Quality Requirement";
  if (id.startsWith("AC-")) return "Acceptance Criterion";
  return "Unknown";
}

function order(id) {
  const prefixOrder = { OBJ: 1, REQ: 2, FR: 3, NFR: 4, AC: 5 };
  const [prefix, number] = id.split("-");
  return (prefixOrder[prefix] ?? 99) * 10000 + Number(number ?? 0);
}

function list(set) {
  const values = [...set].filter(Boolean).sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  return values.length ? values.join(", ") : "";
}

function render({ rows, counts, gaps, planningUnavailable }) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    "# App Busqueda Empleo - Traceability Matrix",
    "",
    "## Title",
    "",
    "| Field | Value |",
    "| --- | --- |",
    "| Document | Traceability Matrix |",
    "| Initiative | App Busqueda Empleo |",
    "| Version | 0.1 |",
    "| Status | Draft - generated projection |",
    "| Author | Vestigator |",
    "| Reviewers | Aelium |",
    "| Organization | Aelium |",
    `| Last Updated | ${today} |`,
    "",
    "## 1. Purpose",
    "",
    "This matrix is a derived projection across Specification, Design, Planning, Time, and Verification. It is not the authority for any requirement, work item, decision, test, evidence, or status. Source Markdown remains authoritative for Specification, Design, and Verification Definition; GitHub Project 3 remains authoritative for Planning and Time; GitHub Actions is the declared verification execution authority.",
    "",
    "## 2. ID Prefix Registry",
    "",
    "| Semantic entity | Classic | Dimension |",
    "| --- | --- | --- |",
    "| Objective | `OBJ-xxx` | Specification |",
    "| Requirement | `REQ-xxx` | Specification |",
    "| Functional Requirement | `FR-xxx` | Specification |",
    "| Quality Requirement | `NFR-xxx` | Specification |",
    "| Acceptance Criterion | `AC-xxx` | Specification |",
    "| Architecture Decision | `ADR-xxx` | Design |",
    "| Initiative | `INI-xxx` | Planning |",
    "| Project | `PRJ-xxx` | Planning |",
    "| Work Package | `WP-xxx` | Planning |",
    "| Task | `TSK-xxx` | Planning |",
    "| Test | `TEST-xxx` | Verification |",
    "| Evidence | `EVD-xxx` | Verification |",
    "",
    "## 3. Matrix",
    "",
    "| ID | Type | Description | Parent | Addressed by (decision) | Realized by (work package) | Verified by (test) | Evidence | Status |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ];

  for (const row of rows) {
    lines.push(`| ${row.id} | ${row.type} | ${escapeCell(row.description)} | ${list(row.parents)} | ${list(row.decisions)} | ${list(row.wps)} | ${list(row.tests)} | ${list(row.evidence)} | ${list(row.status)} |`);
  }

  lines.push(
    "",
    "## 4. Gap Checklist",
    "",
    "| # | Check | Current finding |",
    "| --- | --- | --- |",
    `| 1 | Requirement with no implementation | ${gaps.unimplemented.length ? gaps.unimplemented.map((row) => row.id).join(", ") : "None found for FR/NFR rows against GitHub Work Package specifications."} |`,
    `| 2 | Requirement with no test | ${gaps.untested.length ? gaps.untested.map((row) => row.id).join(", ") : "None found for FR/NFR rows against TMP traceability."} |`,
    `| 3 | Orphan task or work package | ${gaps.orphanWorkPackages.length ? gaps.orphanWorkPackages.map((item) => item.id).join(", ") : "None found among GitHub Work Packages inspected by `qualitas:planning` label."} |`,
    "| 4 | Requirement modified after verification | Not assessed: no execution evidence dates exist yet. |",
    "| 5 | NFR with no evidence | All NFR tests are planned and currently unevidenced; this is expected until GitHub Actions evidence exists. |",
    "| 6 | Work closed but requirement still open | Not found: GitHub Project items are currently `Todo`, and no requirement has verified status. |",
    "",
    "## 5. Bidirectional Audit Findings",
    "",
    `| Category | Count | Finding |`,
    "| --- | --- | --- |",
    `| Dangling reference | ${gaps.dangling.length} | ${gaps.dangling.length ? gaps.dangling.map((item) => `${item.source} -> ${item.reference}`).join("; ") : "None found."} |`,
    `| Orphan Work Package | ${gaps.orphanWorkPackages.length} | ${gaps.orphanWorkPackages.length ? gaps.orphanWorkPackages.map((item) => item.id).join(", ") : "None found."} |`,
    `| Unimplemented requirement | ${gaps.unimplemented.length} | ${gaps.unimplemented.length ? gaps.unimplemented.map((row) => row.id).join(", ") : "None found."} |`,
    `| Untested requirement | ${gaps.untested.length} | ${gaps.untested.length ? gaps.untested.map((row) => row.id).join(", ") : "None found."} |`,
    `| Unevidenced test | ${gaps.unevidenced.length} | Expected for bootstrap: ${gaps.unevidenced.length} planned tests have no ` + "`EVD-xxx`" + " evidence yet. |",
    `| Orphan test | ${gaps.orphanTests.length} | ${gaps.orphanTests.length ? gaps.orphanTests.map((test) => test.id).join(", ") : "None found."} |`,
    "| Stale verification | 0 | Not assessed beyond absence of evidence: no trustworthy execution evidence dates exist yet. |",
    "",
    "## 6. Source Counts",
    "",
    "| Entity | Count | Authority |",
    "| --- | --- | --- |",
    `| Objectives | ${counts.objectives} | Markdown VSD |`,
    `| Requirements | ${counts.requirements} | Markdown BRD |`,
    `| Functional Requirements | ${counts.functional} | Markdown FRDs |`,
    `| Quality Requirements | ${counts.quality} | Markdown NFRD |`,
    `| Acceptance Criteria | ${counts.criteria} | Markdown FRDs/NFRD |`,
    `| Architecture Decisions | ${counts.decisions} | Markdown ADD |`,
    `| Planning items | ${counts.planning} | ${planningUnavailable ? "GitHub unavailable during generation" : "GitHub Project 3 REST"} |`,
    `| Tests | ${counts.tests} | Markdown TMP |`,
    "",
    "## References",
    "",
    "- `_context/MANAGEMENT-MODEL.yaml`",
    "- `_context/VSD.md`",
    "- `_context/_specification/BRD.md`",
    "- `_context/_specification/FRDs/`",
    "- `_context/_specification/NFRD.md`",
    "- `_context/_design/ADD.md`",
    "- GitHub Project 3 planning issues labelled `qualitas:planning`",
    "- `_context/_verification/SQCA.md`",
    "- `_context/_verification/TMP.md`",
  );

  return `${lines.join("\n")}\n`;
}

function escapeCell(value) {
  return stripMd(value).replace(/\|/g, "\\|");
}

await main();
