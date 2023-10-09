import { useUser } from "@clerk/nextjs";
import { CreatePostWizard, Feed } from "~/components";
import { Layout } from "~/components/ui";

import { api } from "~/utils/api";

export default function Home() {
  api.posts.getAll.useQuery();

  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div />;

  return (
    <Layout>
      <div className="flex border-b border-slate-400 p-4">
        {!!isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </Layout>
  );
}
