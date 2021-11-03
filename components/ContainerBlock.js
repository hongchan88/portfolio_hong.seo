import React from "react";

import { useRouter } from "next/router";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ContainerBlock({ children, aboutRef }) {
  const router = useRouter();

  return (
    <div>
      <main className="dark:bg-red-800 w-full">
        <Navbar aboutRef={aboutRef} />
        <div className="main-contents">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
