"use client";

import { useEffect } from "react";

function hasInviteAuthParams() {
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  const params = new URLSearchParams(hash || window.location.search);
  const type = params.get("type");

  return (
    Boolean(params.get("access_token") && params.get("refresh_token")) &&
    (type === "invite" || type === "recovery" || window.location.pathname !== "/auth/set-password")
  );
}

export function AuthInviteRedirect() {
  useEffect(() => {
    if (window.location.pathname === "/auth/set-password" || !hasInviteAuthParams()) {
      return;
    }

    const authSuffix = window.location.hash || window.location.search;
    window.location.replace(`/auth/set-password${authSuffix}`);
  }, []);

  return null;
}
