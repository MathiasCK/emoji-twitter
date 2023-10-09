import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticProps, NextPage } from "next";
import React from "react";
import { appRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { db } from "~/server/db";
import SuperJSON from "superjson";
import Head from "next/head";

const ProfileView: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <div>{data.username}</div>
    </>
  );
};

export const getStaticPaths = () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: SuperJSON,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("Invalid slug");

  const username = slug.replace("@", "");

  // This will prefetch all the data, meaning "isLoading" for api.profile.getUserByUsername will never be true when page is rendered
  await ssg.profile.getUserByUsername.prefetch({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export default ProfileView;
