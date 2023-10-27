import { getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]/route";

export default async function ReposPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <div>
        <h1>Protected Content</h1>
        <p>
          Congratulations, {session.user?.name}, you are successfully logged in!
        </p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>Protected Content</h1>
      <p>Please log in to view.</p>
    </div>
  );
}
