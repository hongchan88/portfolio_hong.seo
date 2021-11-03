import Head from "next/head";
import react, { useState } from "react";
import AboutMe from "../components/AboutMe";
import ContainerBlock from "../components/ContainerBlock";

import Hero from "../components/Hero";
import Projects from "../components/Projects";

export default function Home() {
  const [aboutRef, setAboutRef] = useState();
  const scrollAbout = (ref) => {
    setAboutRef(ref);
  };
  return (
    <ContainerBlock aboutRef={aboutRef}>
      <Hero />
      <AboutMe scrollAbout={scrollAbout} />
      <Projects />
    </ContainerBlock>
  );
}
