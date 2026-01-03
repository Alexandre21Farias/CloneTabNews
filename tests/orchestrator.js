import retry from "async-retry";

async function waitForAllServices() {
  await weitForWebServer();

  async function weitForWebServer() {
    return retry(fetchStatusPage, { retries: 100, maxTimeout: 1000 });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) throw Error();
    }
  }
}

const ocherstrator = {
  waitForAllServices,
};

export default ocherstrator;
