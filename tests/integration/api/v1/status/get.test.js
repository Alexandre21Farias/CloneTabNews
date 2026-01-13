import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.update_at).toBeDefined();

      const parseUpdateAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toBe(parseUpdateAt);

      expect(responseBody.dependencies.version).toEqual("18.1");

      expect(responseBody.dependencies.max_connections).toEqual("100");

      expect(responseBody.dependencies.database_connections).toEqual(1);
    });
  });
});
