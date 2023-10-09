import React from "react";
import { api } from "~/utils/api";

const ProfileView = () => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: "mathiasck",
  });

  if (!data) return <div>404</div>;

  return <div>{data.username}</div>;
};

export default ProfileView;
