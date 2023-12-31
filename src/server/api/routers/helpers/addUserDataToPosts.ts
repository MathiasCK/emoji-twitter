import { clerkClient } from "@clerk/nextjs";
import type { Post } from "@prisma/client";
import { filterUserForClient } from "./filterUserForClient";
import { TRPCError } from "@trpc/server";

export const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post: Post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  const filtteredUsersWithPosts = posts.map((post: Post) => {
    const author = users.find((user) => user.id === post.authorId);

    if (!author?.username) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }

    return {
      post,
      author: {
        ...author,
        username: author.username,
      },
    };
  });

  return filtteredUsersWithPosts;
};
