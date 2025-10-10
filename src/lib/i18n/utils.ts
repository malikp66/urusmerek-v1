import type { Messages } from "./dictionaries";

function getPath(messages: Messages, path: string | undefined) {
  if (!path) return messages;

  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      // @ts-expect-error -- dynamic access
      return acc[key];
    }
    return undefined;
  }, messages);
}

export function createTranslator(messages: Messages, namespace?: string) {
  return <T = string>(key?: string) => {
    const fullPath = [namespace, key].filter(Boolean).join(".");
    const value = getPath(messages, key ? fullPath : namespace);
    return (value ?? key ?? namespace) as T;
  };
}

export function pickNamespace<T = unknown>(messages: Messages, namespace: string): T {
  return createTranslator(messages)(namespace) as T;
}
