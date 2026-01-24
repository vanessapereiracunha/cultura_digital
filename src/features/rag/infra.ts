import { httpClient } from "../../core/http/client";
import { RAG_BASE_URL } from "../../core/config/api";

export function postRag<T>(path: string, body: unknown): Promise<T> {
  return httpClient.post<T>(`${RAG_BASE_URL}${path}`, body);
}
