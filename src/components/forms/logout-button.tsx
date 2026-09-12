"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  async function handleSignOut() {
    await signOut({
      redirect: false,
    });

    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Sign out
    </button>
  );
}