import { UserButton, useUser } from "@clerk/nextjs";
import React from "react";

const Navbar = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div />;

  return (
    !!isSignedIn && (
      <div className="flex justify-end border-b border-slate-400 p-4">
        <UserButton />
      </div>
    )
  );
};

export default Navbar;
