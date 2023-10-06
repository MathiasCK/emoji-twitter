import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/dist/types/server";
import type { Post, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filterUserForClient = ({ id, username, profileImageUrl }: User) => ({
  id,
  username,
  profileImageUrl,
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const prisma: PrismaClient = ctx.db;

    const posts = await prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

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
  }),

  create: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(255),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const prisma: PrismaClient = ctx.db;

      const post = await prisma.post.create({
        data: {
          authorId: ctx.userId,
          content: input.content,
        },
      });

      return post;
    }),
});
