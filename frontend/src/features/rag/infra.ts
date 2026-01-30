import { httpClient } from "../../core/http/client";
import { RAG_BASE_URL } from "../../core/config/api";

export async function postRag<T>(path: string, body: unknown): Promise<T> {
  const url = `${RAG_BASE_URL}${path}`;
  console.log(`[RAG] Request to ${url}`, body);
  
  try {
    return await httpClient.post<T>(url, body);
  } catch (error) {
    console.error(`[RAG] Error in request to ${url}:`, error);
    throw error;
  }
}