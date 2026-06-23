import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function useRequireAuth() {
  const authed = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (!authed) {
      navigate({ to: "/login", search: { redirect: pathname } });
    }
  }, [authed, navigate, pathname]);
  return authed;
}
