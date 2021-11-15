import React, { useEffect, useRef } from "react";

export default function AboutMe({ setAbout }) {
  const aboutMe = useRef(null);
  useEffect(() => {
    setAbout(aboutMe);
  }, []);
  return (
    <section ref={aboutMe} id="aboutme" className="bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800">
        <h1 className=" text-5xl md:text-9xl font-bold py-20 text-center md:text-left">
          About Me.
        </h1>
      </div>
      <div className="bg-[#F1F1F1] -mt-10 dark:bg-gray-900">
        <div className="text-container max-w-6xl mx-auto pt-20">
          <p
            className="leading-loose text-2xl md:text-4xl font-semibold  mx-4"
            style={{ lineHeight: "3rem" }}
          >
            I'm a software developer who loves building products and web
            applications that impact millions of lives.
            <a className="bg-red-500 rounded-md px-2 py-1 text-white">👨‍💻</a>
          </p>
        </div>
      </div>
      <div className="bg-[#F1F1F1] dark:bg-gray-900 px-4">
        <div className="pt-20 grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-y-20 gap-x-20">
          {/* Social Buttons */}
          <div className="inline-flex flex-col">
            <div>
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Contact
              </h1>
              <p className="text-lg text-gray-500 mt-4 dark:text-gray-300">
                For any sort help / enquiry,{" "}
                <a
                  href={`/contact`}
                  className="text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300"
                >
                  contact
                </a>{" "}
                me and I'll get back.
              </p>
            </div>
            <div className="mt-8">
              <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Job Opportunities
              </h1>
              <p className="text-lg text-gray-500 mt-4 dark:text-gray-300">
                I'm currently looking for a job, If you see me as a good fit for
                your company, you may{" "}
                <a
                  href={"/contact"}
                  className="text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300"
                >
                  contact
                </a>{" "}
                me . and I'd love to be a part of your company.
              </p>
            </div>
            {/* Social Links */}
            {/* <h1 className="text-xl font-semibold text-gray-700 mt-8 dark:text-gray-200">
              Social Links
            </h1> */}
            {/* <div className="mt-4 ml-4">
              <div className="flex flex-row justify-start items-center">
                <a className="flex flex-row items-center space-x-4 group">
                  <div className="my-4">&rarr;</div>
                  <p className="text-lg text-gray-500 font-mono relative overflow-hidden dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    GitHub
                  </p>
                </a>
              </div>
              <div className="flex flex-row justify-start items-center">
                <a className="flex flex-row items-center space-x-4 group">
                  <div className="my-4">&rarr;</div>
                  <p className="text-lg text-gray-500 font-mono relative overflow-hidden dark:text-gray-300">
                    <div className="absolute h-0.5 w-full bg-gray-400 bottom-0 transform -translate-x-24 group-hover:translate-x-0 transition duration-300"></div>
                    LinkedIn
                  </p>
                </a>
              </div>
            </div> */}
          </div>
          {/* Text area */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-xl text-gray-700 mb-4 dark:text-gray-300 ">
              Hello! I'm Hong and I enjoy building things that live on the
              internet. I believe tech will change the way we live. My personal
              mission is to develop softwares that could change people's lives.
            </p>
            <p className="text-xl text-gray-700 mb-4 dark:text-gray-300 ">
              I just finished my diploma of website development course in TAFE.
              It wasn't easy to finish the course while working as a full time.
              However, I have learned to become a goal-oriented person with a
              mindset of can-do attitude.
            </p>
            <p className="text-xl text-gray-700 mb-4 dark:text-gray-300 ">
              I figured out that my skills and personalities are a good fit to
              become a software developer. Currently, I'm enjoying the process
              to become an expert. Here are a few technologies I've been taught
              myself along the journey :
            </p>

            <h1 className="bg-red-500 text-3xl rounded-md px-2 py-1 inline-block font-bold text-gray-50">
              Tech Stack
            </h1>
            <div className="flex flex-row flex-wrap mt-8">
              <img
                title="HTML5"
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="CSS3"
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="tailwind"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="JavaScript"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
              />
              <img
                title="ReacJS"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
              />

              <img
                title="TypeScript"
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="Express.js"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="Node.js"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="GraphQL"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />

              <img
                title="Firebase"
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/firebase/firebase.png"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="MySQL"
                src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mysql/mysql.png"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="Next.js"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="jest"
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="Prisma"
                src="img/prisma.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
              <img
                title="Apollo"
                src="https://www.vectorlogo.zone/logos/apollographql/apollographql-icon.svg"
                className="h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
