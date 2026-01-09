import database from "infra/database.js";

export default async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersion = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersion.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseConnectionsResult = await database.query({
    text: `SELECT * FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });
  const databaseConnectionsValue = databaseConnectionsResult.rows.length;
  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      version: databaseVersionValue,
      max_connections: databaseMaxConnectionsValue,
      database_connections: databaseConnectionsValue,
    },
  });
}
