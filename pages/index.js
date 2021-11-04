import { route } from "next/dist/server/router";
import Head from "next/head";
import router, { useRouter } from "next/router";
import react, { useEffect, useState } from "react";
import AboutMe from "../components/AboutMe";
import ContainerBlock from "../components/ContainerBlock";

import Hero from "../components/Hero";
import Projects from "../components/Projects";

export default function Home() {
  const [aboutRef, setAboutRef] = useState();
  const [projectRef, setProjectRef] = useState();
  const router = useRouter();
  useEffect(() => {
    if (router.query.name === "about") {
      console.log(router.query.name);

      if (aboutRef && aboutRef.current /* + other conditions */) {
        aboutRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (router.query.name === "projects") {
      console.log(router.query.name);

      if (projectRef && projectRef.current /* + other conditions */) {
        projectRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [aboutRef, projectRef, router.query.name]);

  const setAbout = (ref) => {
    setAboutRef(ref);
  };
  const setProject = (ref) => {
    setProjectRef(ref);
  };
  return (
    <ContainerBlock aboutRef={aboutRef} projectRef={projectRef}>
      <Hero />
      <AboutMe setAbout={setAbout} />
      <Projects setProject={setProject} />
    </ContainerBlock>
  );
}
