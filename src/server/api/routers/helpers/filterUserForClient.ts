import type { User } from "@clerk/nextjs/dist/types/server";

export const filterUserForClient = ({
  id,
  username,
  profileImageUrl,
}: User) => ({
  id,
  username,
  profileImageUrl,
});
