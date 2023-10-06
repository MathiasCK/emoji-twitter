import { Post, PrismaClient } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }): Promise<Post[]> => {
    const prisma: PrismaClient = ctx.db;
    return prisma.post.findMany();
  }),
});
