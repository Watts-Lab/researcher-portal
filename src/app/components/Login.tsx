"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    return (
      <button className="btn btn-neutral" onClick={() => signOut()}>
        Sign out
      </button>
    );
  }
  return (
    <button className="btn btn-primary" onClick={() => signIn()}>
      Sign in
    </button>
  );
}
