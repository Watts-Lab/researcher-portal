import { getServerSession } from "next-auth/next";
import { authOptions } from "@/api/auth/[...nextauth]/route";
// import github from "./github";
import { Octokit } from "octokit";

export default async function ReposPage() {
  const session = await getServerSession(authOptions);
  // const client = await github();

  const renderRepoCard = (repo) => {
    return (
      <div className="card w-5/6 bg-base-200 shadow-xl m-5" key={repo.id}>
        <div className="card-body">
          <h2 className="card-title">{repo.name}</h2>
          <p>{repo.description}</p>
        </div>
      </div>
    );
  };

  if (session) {
    const { accessToken } = session;
    const octokit = new Octokit({
      auth: accessToken,
    });

    const repos = await octokit.rest.repos.listForAuthenticatedUser({
      per_page: 10,
    });

    return (
      <div>
        <h1>Protected Content</h1>
        <p>
          Congratulations, {session.user?.name}, you are successfully logged in!
        </p>
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <div className="flex flex-col justify-center">
          {repos.data.map(renderRepoCard)}
        </div>
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
