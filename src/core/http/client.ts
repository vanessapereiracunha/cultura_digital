type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  method: HttpMethod,
  url: string,
  body?: unknown,
): Promise<T> {
  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);

  if (!response.ok) {
    let message = `Erro HTTP ${response.status}`;

    try {
      const data = (await response.json()) as { detail?: unknown };
      if (typeof data.detail === "string" && data.detail.trim()) {
        message = data.detail;
      }
    } catch {

    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export const httpClient = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, body: unknown) => request<T>("POST", url, body),
};