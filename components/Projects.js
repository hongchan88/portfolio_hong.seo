import React from "react";

export default function Projects() {
  const projects = [
    {
      title: "Boot drive Thru",
      link: "www.google.com",
      imgUrl: "",
      number: "",
      info: "customer service",
      stacks: "react firebase",
    },
    {
      title: "Boot drive Thru",
      link: "www.google.com",
      imgUrl: "",
      number: "",
      info: "",
      stacks: "",
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-800">
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
              <ProjectInfo info={proj.info} stacks={proj.stacks} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
const ProjectInfo = ({ info, stacks }) => {
  return (
    <div className="w-full px-5 py-5">
      <h1>this is project {info}</h1>
      <h1>react firebase {stacks}</h1>
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
