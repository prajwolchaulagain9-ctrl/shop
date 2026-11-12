"use client";
import { useEffect, useState } from "react";
export function useRemoteData<T>(
  url: string | null,
  version: string | number = 0,
) {
  const key = `${url}:${version}`;
  const [result, setResult] = useState<{
    key: string;
    data?: T;
    error?: string;
  }>();
  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.message || "Please try again.");
        return body as T;
      })
      .then((data) => {
        if (!controller.signal.aborted) setResult({ key, data });
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            error: error instanceof Error ? error.message : "Please try again.",
          });
      });
    return () => controller.abort();
  }, [url, key]);
  return {
    data: result?.data,
    loading: Boolean(url && result?.key !== key),
    error: result?.key === key ? result.error : undefined,
  };
}
