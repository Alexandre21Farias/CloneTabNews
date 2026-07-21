import retry from "async-retry";
import database from "../infra/database.js";
import migrator from "../infra/migrator.js";

let resolvedBaseUrl = null;
let originalFetch = global.fetch;
let fetchPatched = false;

async function waitForAllServices() {
  patchGlobalFetch();
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, { retries: 100, maxTimeout: 1000 });

    async function fetchStatusPage() {
      const baseUrl = await resolveBaseUrl();
      const response = await originalFetch(`${baseUrl}/api/v1/status`);

      if (response.status !== 200) throw Error();
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

function patchGlobalFetch() {
  if (fetchPatched) return;

  global.fetch = async (input, init) => {
    const inputUrl = typeof input === "string" ? input : input?.url;

    if (
      typeof inputUrl === "string" &&
      inputUrl.startsWith("http://localhost:3000")
    ) {
      const rewrittenUrl = inputUrl.replace(
        "http://localhost:3000",
        resolvedBaseUrl || "http://127.0.0.1:3000",
      );

      if (typeof input === "string") {
        return originalFetch(rewrittenUrl, init);
      }

      return originalFetch(new Request(rewrittenUrl, input), init);
    }

    return originalFetch(input, init);
  };

  fetchPatched = true;
}

async function resolveBaseUrl() {
  if (resolvedBaseUrl) return resolvedBaseUrl;

  const candidateUrls = [
    process.env.BASE_URL,
    process.env.NEXT_PUBLIC_BASE_URL,
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3001",
    "http://localhost:3001",
    "http://127.0.0.1:3002",
    "http://localhost:3002",
    "http://127.0.0.1:3003",
    "http://localhost:3003",
  ].filter(Boolean);

  for (const candidateUrl of candidateUrls) {
    try {
      const response = await originalFetch(`${candidateUrl}/api/v1/status`);

      if (response.status === 200) {
        resolvedBaseUrl = candidateUrl;
        return resolvedBaseUrl;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Serviço web não respondeu em nenhuma porta conhecida.");
}

const ocherstrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default ocherstrator;
