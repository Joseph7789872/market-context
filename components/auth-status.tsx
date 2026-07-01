import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";

export async function AuthStatus() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link className="button" href="/login">
        Sign in
      </Link>
    );
  }

  return (
    <form action={signOutAction} className="filter-list">
      <span className="sidebar-label">{user.email}</span>
      <button className="button" type="submit">
        Sign out
      </button>
    </form>
  );
}
