import React, { useEffect, useRef } from 'react';

export default function Projects({ setProject }) {
  const projects = [
    {
      title: 'Image Resizer App',
      link: 'https://www.keta-help.com/?from=resume',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677282754/portfolio/ojwrq345s3qrmv4afqt7.png',
      info: `I built a full-stack web application for resizing images for visa applications using NextJS, Tailwind, and AWS Amplify. The application uses the SendGrid API to send emails to users.`,
      stacks: ['nextjs', 'tailwind', 'amplify', 'sendgrid'],
      git: 'https://github.com/hongchan88/k-app',
      live: 'https://www.keta-help.com/?from=resume',
    },
    {
      title: 'Star Wars Movie App',
      link: 'https://star-wars-api-hong.vercel.app/',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1640824416/portfolio/bqevtrmvfqkocbddby0c.png',

      info: `This project was built on Next.Js using public Star wars API. It will pre-render page using static generation as it was the best practice to use when API data does not change often. This will give a fast loading webpage, and SEO efficiency.`,
      stacks: ['nextjs', 'scss', 'motionframer', 'vercel'],
      git: 'https://github.com/hongchan88/star-wars-api',
      live: 'https://star-wars-api-hong.vercel.app/',
    },
    {
      title: 'Boot Drive Thru',
      link: 'https://boot-drive-thru.netlify.app/',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459643/portfolio/bzrhiuinz3tlqfrovjbg.png',

      info: `This is the project that I started during covid lockdown. I had an idea that this E-commerce platform could be in demand as consumer's behaviour changed because they prefer contactless shopping during pandemic.`,
      stacks: ['javascript', 'react', 'firebase', 'tailwind', 'netflify'],
      git: 'https://github.com/hongchan88/driveboot',
      live: 'https://boot-drive-thru.netlify.app/',
    },
    {
      title: 'Noogle',
      link: 'https://netflix-noogle-search-movie.vercel.app/',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1639613226/portfolio/tqrzdspkhhwyupksruv5.png',

      info: `This was my final project from the diploma course of website developement. This website allows users to search for their favourite netflix movies by Title, Year , Country and Director.`,
      stacks: ['react', 'nextjs', 'neo4j', 'apollo', 'vercel', 'graphql'],
      git: 'https://github.com/hongchan88/Netflix_Noogle_searchMovie',
      live: 'https://netflix-noogle-search-movie.vercel.app/',
    },
    {
      title: 'BecomeID',
      link: 'https://becomeid.netlify.app/',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459640/portfolio/imeaazfuvl0v3fnilozb.png',
      live: 'https://becomeid.netlify.app/',
      info: 'A person is represented by numerous identification such as car plates number , address , location . With this platform, one can easily connect with someone just by searching their identification registered in the platform.',
      stacks: ['react', 'apollo', 'prisma', 'graphql', 'netflify'],
      git: 'https://github.com/hongchan88/becomeID-backend',
    },
    {
      title: 'Simple API Service',
      link: 'https://github.com/hongchan88/Simple_API_ExpressJs',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459646/portfolio/fkdoj7cza7aol9nnpqpq.png',

      info: 'Using MVC architectural pattern was a good coding practice for easy code maintenance. Choosing the same language on front-end and backend can improve developer productivity. JavaScript is everywhere!! 👍',
      stacks: ['nodejs', 'expressjs', 'jest', 'postman'],
      git: 'https://github.com/hongchan88/Simple_API_ExpressJs',
    },
    {
      title: 'Portfolio website',
      link: 'https://github.com/hongchan88/portfolio_hong.seo',
      imgUrl:
        'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459648/portfolio/mb0i9wdcje1nqtxrucwq.png',

      info: 'This Portfolio website',
      stacks: ['react', 'nextjs', 'tailwind'],
      git: 'https://github.com/hongchan88/portfolio_hong.seo',
    },
  ];

  const projectRef = useRef(null);
  useEffect(() => {
    setProject(projectRef);
  }, []);

  return (
    <section
      ref={projectRef}
      id='projects'
      className='bg-white dark:bg-gray-800'
    >
      <div className='max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800'>
        <h1 className=' text-5xl md:text-9xl font-bold py-20 text-center md:text-left'>
          Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className='bg-[#F1F1F1] dark:bg-gray-900'>
        {projects.map((proj, idx) => (
          <div className='max-w-6xl mx-auto gap-20 py-10 pb-20'>
            <div className='flex mt-14'>
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
      case 'javascript':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
          desc: 'JavaScript',
        };

      case 'react':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
          desc: 'ReactJS',
        };
      case 'firebase':
        return {
          url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/firebase/firebase.png',
          desc: 'Firebase',
        };
      case 'tailwind':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
          desc: 'Tailwind CSS',
        };
      case 'netflify':
        return {
          url: 'https://api.iconify.design/logos/netlify.svg',
          desc: 'Netlify',
        };
      case 'cloudinary':
        return {
          url: 'https://res.cloudinary.com/cloudinary-marketing/image/upload/v1599098500/creative_source/Logo/Cloud%20Glyph/cloudinary_cloud_glyph_blue_png.png',
          desc: 'Cloudinary',
        };
      case 'apollo':
        return {
          url: 'https://www.vectorlogo.zone/logos/apollographql/apollographql-icon.svg',
          desc: 'Apollo',
        };
      case 'graphql':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
          desc: 'GraphQL',
        };
      case 'prisma':
        return {
          url: 'img/prisma.svg',
          desc: 'Prisma',
        };
      case 'nodejs':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
          desc: 'NodeJS',
        };
      case 'expressjs':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg',
          desc: 'Express.js',
        };
      case 'jest':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
          desc: 'jest',
        };
      case 'postman':
        return {
          url: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
          desc: 'POSTMAN',
        };
      case 'nextjs':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg',
          desc: 'NextJS',
        };
      case 'neo4j':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original-wordmark.svg',
          desc: 'Neo4j',
        };
      case 'vercel':
        return {
          url: 'https://res.cloudinary.com/dwbsxpk82/image/upload/v1639612757/portfolio/prd7rdrrbtqku95c6igm.svg',
          desc: 'Vercel',
        };
      case 'scss':
        return {
          url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
          desc: 'SASS',
        };
      case 'motionframer':
        return {
          url: 'https://logosandtypes.com/wp-content/uploads/2021/04/Framer-Motion.png',
          desc: 'motion framer',
        };
      case 'amplify':
        return {
          url: 'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677286540/portfolio/xpshbpdf2rjayr909ewj.svg',
          desc: 'amplify',
        };
      case 'sendgrid':
        return {
          url: 'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677286641/portfolio/o8nk0yiaqaztzwz7nj4i.jpg',
          desc: 'sendgrid',
        };
      default:
        return {
          url: '#',
        };

      // code block
    }
  };
  return (
    <div className='w-full px-5 py-1'>
      <div className='relative'>
        <div className='absolute w-full left-0 -top-14'>
          <div className='flex justify-between mb-5'>
            <div className='flex'>
              <h1 className='text-lg sm:text-4xl font-bold text-black-50'>
                {title}
              </h1>
            </div>
            <div className='flex '>
              {git && (
                <a
                  href={git}
                  target={'_blank'}
                  className='dark:bg-yellow-50 rounded-lg mx-1'
                >
                  <img
                    className='h-10 w-10 mx-4 '
                    src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'
                  />
                </a>
              )}
              {live && (
                <a
                  href={live}
                  target={'_blank'}
                  className='dark:bg-yellow-50 rounded-lg'
                >
                  <img
                    className='h-10 w-10 mx-4 '
                    src='https://img.icons8.com/pastel-glyph/64/000000/external-link--v1.png'
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between h-full'>
        <div className='flex'>
          <h1 className='text-lg mt-5'>{info}</h1>
        </div>

        <div className='flex-col'>
          <h1 className='bg-red-500 text-xl rounded-md px-2 py-1 inline-block font-bold text-gray-50'>
            Tech Stack Used
          </h1>
          <div className='flex flex-wrap'>
            {arrayStacks.map((stack) => {
              const stackInfo = getStackImg(stack);
              return (
                <img
                  className='h-14 w-14 mx-4 my-4 dark:bg-white rounded-lg'
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
    <a href={link} className='hidden md:block w-full shadow-2xl'>
      <div className='relative overflow-hidden'>
        <div className='h-72 object-cover'>
          <img
            src={imgUrl}
            alt='portfolio'
            className='transform hover:scale-125 transition duration-2000 ease-out object-contain h-full w-full'
          />
        </div>
        <h1 className='absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2'>
          {title}
        </h1>
        <h1 className='absolute bottom-10 left-10 text-gray-50 font-bold text-xl'>
          {number.length === 1 ? '0' + number : number}
        </h1>
      </div>
    </a>
  );
};
