export const projectsData = [
  {
    title: 'Image Resizer App',
    link: 'https://kappimageresize.vercel.app/?from=resume',
    imgUrl:
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677282754/portfolio/ojwrq345s3qrmv4afqt7.png',
    info: `I built a full-stack web application for resizing images for visa applications using NextJS, Tailwind, and AWS Amplify. The application uses the SendGrid API to send emails to users.`,
    stacks: ['nextjs', 'tailwind', 'amplify', 'sendgrid'],
    git: 'https://github.com/hongchan88/k-app',
    live: 'https://kappimageresize.vercel.app/?from=resume',
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
    stacks: ['javascript', 'react', 'firebase', 'tailwind', 'netlify'],
    git: 'https://github.com/hongchan88/driveboot',
    live: 'https://boot-drive-thru.netlify.app/',
  },
  {
    title: 'Noogle',
    link: 'https://netflix-noogle-search-movie.vercel.app/',
    imgUrl:
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1639613226/portfolio/tqrzdspkhhwyupksruv5.png',

    info: `This was my final project from the diploma course of website developement. This website allows users to search for their favourite netflix movies by Title, Year , Country and Director.`,
    stacks: ['nextjs', 'vercel', 'supabase'],
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
export const stackImages = {
  javascript: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    desc: 'JavaScript',
  },
  react: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    desc: 'ReactJS',
  },
  firebase: {
    url: 'https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/firebase/firebase.png',
    desc: 'Firebase',
  },
  tailwind: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    desc: 'Tailwind CSS',
  },
  netlify: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg',
    desc: 'Netlify',
  },
  cloudinary: {
    url: 'https://res.cloudinary.com/cloudinary-marketing/image/upload/v1599098500/creative_source/Logo/Cloud%20Glyph/cloudinary_cloud_glyph_blue_png.png',
    desc: 'Cloudinary',
  },
  apollo: {
    url: 'https://www.vectorlogo.zone/logos/apollographql/apollographql-icon.svg',
    desc: 'Apollo',
  },
  graphql: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
    desc: 'GraphQL',
  },
  prisma: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg',
    desc: 'Prisma',
  },
  nodejs: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    desc: 'NodeJS',
  },
  expressjs: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg',
    desc: 'Express.js',
  },
  jest: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
    desc: 'Jest',
  },
  postman: {
    url: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
    desc: 'POSTMAN',
  },
  nextjs: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg',
    desc: 'NextJS',
  },
  neo4j: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/neo4j/neo4j-original-wordmark.svg',
    desc: 'Neo4j',
  },
  vercel: {
    url: 'https://res.cloudinary.com/dwbsxpk82/image/upload/v1639612757/portfolio/prd7rdrrbtqku95c6igm.svg',
    desc: 'Vercel',
  },
  scss: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
    desc: 'SASS',
  },
  motionframer: {
    url: 'https://logosandtypes.com/wp-content/uploads/2021/04/Framer-Motion.png',
    desc: 'Motion Framer',
  },
  amplify: {
    url: 'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677286540/portfolio/xpshbpdf2rjayr909ewj.svg',
    desc: 'Amplify',
  },
  sendgrid: {
    url: 'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677286641/portfolio/o8nk0yiaqaztzwz7nj4i.jpg',
    desc: 'SendGrid',
  },
  supabase: {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
    desc: 'supabase',
  },
};

export const aboutMe = {};
