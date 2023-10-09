import { SignInButton, useUser } from "@clerk/nextjs";
import { CreatePostWizard, Feed } from "~/components";
import { Layout } from "~/components/ui";

import { api } from "~/utils/api";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  if (!isLoaded) return <div />;

  return (
    <Layout>
      <div className="flex border-b border-slate-400 p-4">
        {!isSignedIn ? (
          <div className="flex justify-center">
            <SignInButton />
          </div>
        ) : (
          <CreatePostWizard />
        )}
      </div>
      <Feed />
    </Layout>
  );
}
