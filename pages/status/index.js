import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}
export default function StatusPage() {
  const { data, error, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  if (error) return <p>Erro ao carregar status</p>;

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt data={data} isLoading={isLoading} />
      <DependenciasStatus data={data} isLoading={isLoading} />
    </>
  );
}

function UpdatedAt({ data, isLoading }) {
  const updatedAt = new Date(data?.update_at).toLocaleString("pt-BR");

  return <p>Atualizado em: {isLoading ? "Carregando..." : updatedAt}</p>;
}

function DependenciasStatus({ data, isLoading }) {
  const dependencias = data?.dependencies;
  console.log(dependencias);
  return (
    <div>
      <h2>Dependências</h2>

      {isLoading ? (
        "Carregando..."
      ) : (
        <ul>
          {Object.entries(dependencias).map(([nome, valor]) => (
            <li key={nome}>
              <strong>{nome}</strong>: {valor}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
