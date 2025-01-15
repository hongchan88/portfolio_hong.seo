const stackImages = {
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
    url: 'https://api.iconify.design/logos/netlify.svg',
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
    url: '/assets/images/stacks/prisma.svg',
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
};

export const getStackImg = (stack: string) =>
  stackImages[stack] || { url: '#', desc: 'Unknown Stack' };
