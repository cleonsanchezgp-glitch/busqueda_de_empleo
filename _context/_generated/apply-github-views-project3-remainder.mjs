import fs from "node:fs/promises";

const API = "https://api.github.com";
const API_VERSION = "2026-03-10";
const owner = "cleonsanchezgp-glitch";
const repository = "busqueda_de_empleo";
const projectNumber = 3;
const projectBase = `${API}/users/${owner}/projectsV2/${projectNumber}`;
const receiptPath = new URL("./github-view-receipts.json", import.meta.url);
const planHash = "eb442b265602f1cb690504a115ffd3d3f2f43c90d7915e1937646a2f443ac98b";

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error("GH_TOKEN or GITHUB_TOKEN is required");

const operations = [
  {
    id: "work_packages",
    body: {
      name: "02 · Work Packages",
      layout: "table",
      filter: "is:issue label:\"qualitas:planning\" label:\"work:work-package\"",
      visible_fields: [411395228, 411395235, 411395242, 411395233, 411403294, 411403310, 411403320, 411403323],
    },
  },
  {
    id: "tasks_by_work_package",
    body: {
      name: "03 · Tasks by Work Package",
      layout: "table",
      filter: "is:issue label:\"qualitas:planning\" label:\"work:task\"",
      visible_fields: [411395228, 411395235, 411395242, 411395243, 411395233, 411403294, 411403323],
    },
  },
  {
    id: "traceability_register",
    body: {
      name: "04 · Traceability Register",
      layout: "table",
      filter: "is:issue label:\"qualitas:planning\"",
      visible_fields: [411395228, 411395242, 411403294, 411403323, 411403320, 411395233],
    },
  },
  {
    id: "work_by_project",
    body: {
      name: "05 · Work by PRJ",
      layout: "table",
      filter: "is:issue label:\"qualitas:planning\" has:PRJ",
      visible_fields: [411395228, 411395235, 411395242, 411395243, 411395233, 411403294, 411403310, 411403320, 411403323, 411403324],
      group_by: [411403324],
      sort_by: [[411403294, "asc"]],
    },
  },
];

async function main() {
  const journal = await readJournal();
  const results = [];
  for (const operation of operations) {
    if (journal.views[operation.id]?.state === "created") {
      results.push({ id: operation.id, state: "already_created", html_url: journal.views[operation.id].html_url });
      continue;
    }
    if (journal.views[operation.id]?.state && journal.views[operation.id].state !== "created") {
      throw new Error(`Unresolved receipt for ${operation.id}; inspect before continuing`);
    }
    journal.views[operation.id] = {
      state: "intent",
      name: operation.body.name,
      plan_hash: planHash,
      requested_at: new Date().toISOString(),
      request: operation.body,
    };
    await saveJournal(journal);
    try {
      const data = await postJson(`${projectBase}/views`, operation.body);
      const view = data.value ?? data;
      if (!Number.isSafeInteger(Number(view?.id)) || view.name !== operation.body.name || !validViewUrl(view.html_url)) {
        throw new Error(`Unexpected create response: ${JSON.stringify(data)}`);
      }
      journal.views[operation.id] = {
        ...journal.views[operation.id],
        state: "created",
        id: Number(view.id),
        html_url: view.html_url,
        created_at: new Date().toISOString(),
      };
      await saveJournal(journal);
      results.push({ id: operation.id, state: "created", view_id: Number(view.id), html_url: view.html_url });
    } catch (error) {
      journal.views[operation.id] = {
        ...journal.views[operation.id],
        state: "uncertain",
        error: error instanceof Error ? error.message : String(error),
      };
      await saveJournal(journal);
      throw error;
    }
  }
  console.log(JSON.stringify({ ok: true, results, receipt_path: String(receiptPath.pathname) }, null, 2));
}

async function readJournal() {
  const journal = JSON.parse(await fs.readFile(receiptPath, "utf8"));
  const expected = { api: API, owner, repository, number: projectNumber };
  if (journal.version !== 1 || JSON.stringify(journal.project) !== JSON.stringify(expected) || !journal.views || Array.isArray(journal.views)) {
    throw new Error("View journal does not match Project 3");
  }
  return journal;
}

async function saveJournal(journal) {
  await fs.writeFile(receiptPath, `${JSON.stringify(journal, null, 2)}\n`);
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": API_VERSION,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (response.status !== 201) throw new Error(`POST ${url} failed with ${response.status}: ${JSON.stringify(data)}`);
  return data;
}

function validViewUrl(value) {
  try {
    const url = new URL(value);
    const prefix = `/users/${owner}/projects/${projectNumber}/views/`;
    return url.origin === "https://github.com" && url.pathname.startsWith(prefix) && /^\d+$/.test(url.pathname.slice(prefix.length));
  } catch {
    return false;
  }
}

await main();
