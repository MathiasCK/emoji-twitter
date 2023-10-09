import React from "react";
import type { PropsWithChildren } from "react";

const Layout = (props: PropsWithChildren) => (
  <main className="flex h-screen justify-center">
    <div className="w-full overflow-y-scroll border-x border-slate-400 md:max-w-2xl">
      {props.children}
    </div>
  </main>
);

export default Layout;
