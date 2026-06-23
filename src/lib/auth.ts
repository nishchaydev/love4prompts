import { useEffect, useState } from "react";

const KEY = "l4p_auth_v1";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function signIn(): void {
  try {
    window.localStorage.setItem(KEY, "1");
    window.dispatchEvent(new Event("l4p:auth"));
  } catch {}
}

export function signOut(): void {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("l4p:auth"));
  } catch {}
}

export function useAuth() {
  const [authed, setAuthed] = useState<boolean>(() => isAuthed());
  useEffect(() => {
    const update = () => setAuthed(isAuthed());
    update();
    window.addEventListener("l4p:auth", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("l4p:auth", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return authed;
}
