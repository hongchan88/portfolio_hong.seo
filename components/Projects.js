import React, { useEffect, useRef } from "react";

export default function Projects({ setProject }) {
  const projects = [
    {
      title: "Boot drive Thru",
      link: "www.google.com",
      imgUrl: "",
      number: "",
      info: "customer service",
      stacks: ["javascript", "react"],
      git: "ssldkfj",
    },
    {
      title: "Boot Drive Thru",
      link: "www.google.com",
      imgUrl: "/img/bootdrive.png",
      number: "",
      info: `Project that I created during covid locked down.😂\n I had an idea✨ that this ecommerce platform could be in demand as people's bahaviour changed to avoid contact with others when they shopping.`,
      stacks: ["javascript", "react", "firebase", "tailwind", "netflify"],
      git: "git.com",
      live: "https://boot-drive-thru.netlify.app/",
    },
  ];

  const projectRef = useRef(null);
  useEffect(() => {
    setProject(projectRef);
  }, []);

  return (
    <section
      ref={projectRef}
      id="projects"
      className="bg-white dark:bg-gray-800"
    >
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800">
        <h1 className=" text-5xl md:text-9xl font-bold py-20 text-center md:text-left">
          Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className="bg-[#F1F1F1] dark:bg-gray-900">
        {projects.map((proj, idx) => (
          <div className="max-w-6xl mx-auto  gap-20 py-10 pb-10">
            <div className="flex">
              <ProjectCard
                title={proj.title}
                link={proj.link}
                imgUrl={proj.imgUrl}
                number={`${idx + 1}`}
              />
              <ProjectInfo
                info={proj.info}
                stacks={proj.stacks}
                live={proj.live}
                git={proj.git}
                title={proj.title}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
const ProjectInfo = ({ title, info, stacks, git, live }) => {
  const arrayStacks = [...stacks];
  const getStackImg = (stack) => {
    switch (stack) {
      case "javascript":
        return {
          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
          desc: "JavaScript",
        };

      case "react":
        return {
          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
          desc: "ReactJS",
        };
      case "firebase":
        return {
          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
          desc: "Firebase",
        };
      case "tailwind":
        return {
          url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
          desc: "Tailwind CSS",
        };
      case "netflify":
        return {
          url: "https://api.iconify.design/logos/netlify.svg",
          desc: "Netlify",
        };
      default:
      // code block
    }
  };
  return (
    <div className="w-full px-5 py-1">
      <div className="relative">
        <div className="absolute w-full left-0 -top-10">
          <div className="flex justify-between">
            <div className="flex">
              <h1 className="text-4xl font-bold text-black-50">{title}</h1>
            </div>
            <div className="flex ">
              {git && (
                <a href={git}>
                  <img
                    className="h-10 w-10 mx-4 "
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                  />
                </a>
              )}
              {live && (
                <a href={live}>
                  <img
                    className="h-10 w-10 mx-4 "
                    src="https://img.icons8.com/pastel-glyph/64/000000/external-link--v1.png"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex">
          <h1 className="text-lg mt-5">{info}</h1>
        </div>

        <div className="flex-col">
          <h1 className="bg-red-500 text-xl rounded-md px-2 py-1 inline-block font-bold text-gray-50">
            Tech Stack Used
          </h1>
          <div className="flex">
            {arrayStacks.map((stack) => {
              const stackInfo = getStackImg(stack);
              return (
                <img
                  className="h-14 w-14 mx-4 my-4"
                  src={stackInfo.url}
                  title={stackInfo.desc}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ title, link, imgUrl, number }) => {
  return (
    <a href={link} className="w-full block shadow-2xl">
      <div className="relative overflow-hidden">
        <div className="h-72 object-cover">
          <img
            src={imgUrl}
            alt="portfolio"
            className="transform hover:scale-125 transition duration-2000 ease-out object-cover h-full w-full"
          />
        </div>
        <h1 className="absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2">
          {title} sdf
        </h1>
        <h1 className="absolute bottom-10 left-10 text-gray-50 font-bold text-xl">
          {number.length === 1 ? "0" + number : number}
        </h1>
      </div>
    </a>
  );
};
