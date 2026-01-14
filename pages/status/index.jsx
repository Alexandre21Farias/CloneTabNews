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
  if (isLoading) return <p>Carregando...</p>;

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt data={data} isLoading={isLoading} />
      <DependenciasStatus data={data} isLoading={isLoading} />
    </>
  );
}

function UpdatedAt({ data, isLoading }) {
  if (isLoading) return <p>Carregando...</p>;

  const updatedAt = new Date(data.update_at).toLocaleString("pt-BR");

  return <p>Atualizado em: {updatedAt}</p>;
}

function DependenciasStatus({ data, isLoading }) {
  if (isLoading) return <p>Carregando...</p>;

  const dependencias = data.dependencies;
  console.log(dependencias);
  return (
    <div>
      <ul>
        {Object.entries(dependencias).map(([nome, valor]) => (
          <li key={nome}>
            <strong>{nome}</strong>: {valor}
          </li>
        ))}
      </ul>
    </div>
  );
}
