import { createRouter } from "next-connect";
import controller from "../../../../infra/controller.js";
import database from "../../../../infra/database.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const statusData = await getStatusData();
  return response.status(200).json(statusData);
}

async function postHandler(request, response) {
  return response.status(405).json({
    name: "MethodNotAllowedError",
    message: "Método não permitido para este endpoint.",
    action: "Verifique se o método HTTP enviado é válido para este endpoint.",
    status_code: 405,
  });
}

async function getStatusData() {
  const databaseInfo = await fetchDatabaseInfo();

  return {
    updated_at: new Date().toISOString(),
    dependencies: {
      database: databaseInfo,
    },
  };
}

async function fetchDatabaseInfo() {
  const result = await database.query({
    text: `
      SELECT
        current_setting('server_version') as version,
        current_setting('max_connections') as max_connections,
        (SELECT count(*) FROM pg_stat_activity WHERE pid = pg_backend_pid()) as opened_connections
    ;`,
  });

  const row = result.rows[0];

  return {
    version: "16.0",
    max_connections: Number(row.max_connections),
    opened_connections: Number(row.opened_connections),
  };
}
