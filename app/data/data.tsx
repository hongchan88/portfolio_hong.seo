import React, { ReactNode } from 'react';

type Project = {
  timelineYear: string;
  title: string;
  imgUrl: string[];
  live?: string;
  description: ReactNode;
  stacks: string[];
  git?: string;
  leetcode?: string;
  link?: string;
};

export const projectsData: Project[] = [
  // {
  //   title: 'BecomeID',
  //   link: 'https://becomeid.netlify.app/',
  //   imgUrl:
  //     'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459640/portfolio/imeaazfuvl0v3fnilozb.png',
  //   live: 'https://becomeid.netlify.app/',
  //   info: `Developed a platform to connect individuals using unique identifiers like car plates or addresses. Built with React, Apollo, Prisma, and GraphQL for robust data handling and queries.`,
  //   stacks: ['react', 'apollo', 'prisma', 'graphql', 'netflify'],
  //   git: 'https://github.com/hongchan88/becomeID-backend',
  // },

  {
    timelineYear: '2025',
    title: 'Portfolio',
    imgUrl: ['projects/2025-2.png', 'projects/2025-1.png'],
    live: 'https://portfolio-hong.seo',
    description: (
      <div>
        <h3 className='font-semibold mb-1'>Personal Portfolio Website</h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>Showcases personal projects and technical skills</li>
          <li>
            Built with <strong>Next.js</strong>, <strong>TypeScript</strong>,
            and <strong>Tailwind CSS</strong> for a responsive design
          </li>
          <li>
            Integrated <strong>3D animation</strong> using{' '}
            <strong>Blender</strong> and <strong>GSAP</strong> for impressive
            visual effects
          </li>
          <li>
            Focused on delivering an engaging and interactive user experience
          </li>
        </ul>
      </div>
    ),
    stacks: ['typescript', 'nextjs', 'tailwind', 'blender', '3djs', 'GSAP'],
    git: 'https://github.com/hongchan88/portfolio_hong.seo',
  },
  {
    timelineYear: '2025',
    title: 'Craftify',
    imgUrl: ['projects/craftify-2.png', 'projects/craftify-1.png'],
    live: 'https://portfolio-hong.seo',
    description: (
      <div>
        <h3 className='font-semibold mb-1'>Personal Portfolio Website</h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>Showcases personal projects and technical skills</li>
          <li>
            Built with <strong>Next.js</strong>, <strong>TypeScript</strong>,
            and <strong>Tailwind CSS</strong> for a responsive design
          </li>
          <li>
            Integrated <strong>3D animation</strong> using{' '}
            <strong>Blender</strong> and <strong>GSAP</strong> for impressive
            visual effects
          </li>
          <li>
            Focused on delivering an engaging and interactive user experience
          </li>
        </ul>
      </div>
    ),
    stacks: ['typescript', 'nextjs', 'tailwind', 'blender', '3djs', 'GSAP'],
    git: 'https://github.com/hongchan88/portfolio_hong.seo',
  },
  {
    title: 'Life as a startup dev ',
    timelineYear: '2022-current',
    description: (
      <div className='mt-6 space-y-6'>
        <div>
          During my time at a startup, I tackled a range of challenges—from
          building new features to debugging and quickly picking up new
          technologies.
        </div>

        <div>
          <h3 className='font-semibold mb-1'>Front-End Development</h3>
          <div>
            Built <strong>responsive, component-based UIs</strong>, managed
            state, and integrated APIs to deliver smooth user experiences.
            Collaborated closely with the design team using{' '}
            <strong>Figma</strong>.
          </div>
        </div>

        <div>
          <h3 className='font-semibold mb-1'>Internal Toolkit</h3>
          <div>
            Contributed to building internal tools that streamlined operations,
            including:
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>
                <strong>QR code</strong> label image generation for label
                printers
              </li>
              <li>
                Customizable legal documents and proposal templates with{' '}
                <strong>PDF export</strong>
              </li>
              <li>
                Quality check report generation as <strong>PDF</strong>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className='font-semibold mb-1'>Retool, Three.js & Analytics</h3>
          <div>
            I worked across multiple internal and growth-focused initiatives:
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>
                Built internal tools using <strong>Retool</strong> to streamline
                operations and reduce manual work
              </li>
              <li>
                Developed the frontend using <strong>Three.js</strong> to
                display <strong>3D models</strong> for interactive
                visualizations
              </li>
              <li>
                Collaborated with the growth team to implement{' '}
                <strong>Segment.io</strong>, integrating it with{' '}
                <strong>Amplitude</strong>, <strong>GTM</strong>, and{' '}
                <strong>CRM platforms</strong>
              </li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className='font-semibold mb-1'>Personal Side Projects</h3>
          <div>
            Even with a packed schedule, I focused on steady progress through
            small, meaningful wins:
            <ul className='list-disc list-inside mt-2 space-y-1'>
              <li>
                Maintained regular <strong>GitHub commits</strong> across
                various projects
              </li>
              <li>
                Completed a <strong>50-day LeetCode challenge streak</strong>
              </li>
              <li>
                Launched a <strong>Figma plugin</strong> as a personal side
                project
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    imgUrl: [
      'projects/2024-4.png',
      'projects/2024-3.png',
      'projects/2024-1.png',
      'projects/2024-2.png',
      'projects/commit-1.png',
      'projects/leetcode-1.png',
    ],
    stacks: [
      'javascript',
      'nextjs',
      'typescript',
      'scss',
      'retool',
      'segment.io',
      '3djs',
      'python',
      'GSAP',
      'AWS',
    ],
    git: 'https://github.com/hongchan88/portfolio_hong.seo',
    leetcode: 'https://leetcode.com/hongchan88/',
  },
  {
    title: 'Figma Plugin',
    timelineYear: '2024',
    imgUrl: ['projects/plugin-1.png'],
    description: (
      <div className='mt-6'>
        <h3 className='font-semibold mb-1'>Figma Plugin</h3>
        <div>
          <ul className='list-disc list-inside mt-2 space-y-1'>
            <li>
              <strong>Built a bulk text-swap feature</strong> to streamline
              repetitive edits across designs
            </li>
            <li>
              <strong>Successfully launched the plugin on Figma</strong>,
              marking a key milestone for the project
            </li>
          </ul>
        </div>
      </div>
    ),
    stacks: ['typescript', 'scss', 'figma'],
    git: '',
    live: 'https://www.figma.com/community/plugin/1422432392194647189/textswapper',
  },

  {
    title: 'Image Resizer App',
    timelineYear: '2023',
    imgUrl: [
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1677282754/portfolio/ojwrq345s3qrmv4afqt7.png',
    ],
    description: (
      <div>
        <h3 className='font-semibold mb-1'>
          Image Resizing Tool for Visa Applications
        </h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>
            Built a full-stack image resizing tool tailored for visa photo
            requirements
          </li>
          <li>
            Developed using <strong>Next.js</strong> and{' '}
            <strong>Tailwind CSS</strong> for responsive and fast performance
          </li>
          <li>
            Integrated <strong>SendGrid API</strong> to automatically email
            processed images to users
          </li>
          <li>
            Focused on a user-friendly interface with clear guidance for photo
            specifications
          </li>
        </ul>
      </div>
    ),
    stacks: ['nextjs', 'tailwind', 'sendgrid', 'supabase'],
    git: 'https://github.com/hongchan88/k-app',
    live: 'https://kappimageresize.vercel.app/?from=resume',
  },
  {
    title: 'Star Wars Movie App',
    timelineYear: '2022',
    imgUrl: [
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1640824416/portfolio/bqevtrmvfqkocbddby0c.png',
    ],

    description: (
      <div>
        <h3 className='font-semibold mb-1'>Star Wars Movie Search Platform</h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>
            Built an interactive movie search platform using{' '}
            <strong>Next.js</strong> and the <strong>Star Wars API</strong>
          </li>
          <li>
            Implemented <strong>Static Site Generation (SSG)</strong> to
            optimize performance and improve SEO
          </li>
          <li>
            Integrated <strong>Framer Motion</strong> for smooth and engaging UI
            animations
          </li>
          <li>
            Focused on clean UX and fast browsing for static data use cases
          </li>
        </ul>
      </div>
    ),
    stacks: ['nextjs', 'scss', 'motionframer', 'vercel'],
    git: 'https://github.com/hongchan88/star-wars-api',
    live: 'https://star-wars-api-hong.vercel.app/',
  },
  {
    title: 'Boot Drive Thru ',
    timelineYear: '2021',
    link: 'https://boot-drive-thru.netlify.app/',
    imgUrl: [
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459643/portfolio/bzrhiuinz3tlqfrovjbg.png',
    ],

    description: (
      <div>
        <h3 className='font-semibold mb-1'>Contactless E-commerce Platform</h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>
            Designed and developed an e-commerce platform inspired by the rise
            of contactless shopping
          </li>
          <li>
            Built using <strong>React</strong>, <strong>Tailwind CSS</strong>,
            and <strong>Firebase</strong>
          </li>
          <li>Focused on delivering a smooth and secure user experience</li>
          <li>
            Adapted to shifting consumer behavior during the COVID-19 pandemic
          </li>
        </ul>
      </div>
    ),
    stacks: ['javascript', 'react', 'firebase', 'tailwind', 'netlify'],
    git: 'https://github.com/hongchan88/driveboot',
    live: 'https://boot-drive-thru.netlify.app/',
  },
  {
    title: 'Netflix Noogle Search Movie',
    timelineYear: '2021',
    link: 'https://netflix-noogle-search-movie.vercel.app/',
    imgUrl: [
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1639613226/portfolio/tqrzdspkhhwyupksruv5.png',
    ],

    description: (
      <div>
        <h3 className='font-semibold mb-1'>
          Netflix-style Movie Search Engine
        </h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>Final project for my Web Development Diploma</li>
          <li>
            Built using <strong>Next.js</strong> and <strong>Supabase</strong>
          </li>
          <li>Implemented search by title, year, country, and director</li>
          <li>
            Focused on a seamless, responsive, and user-friendly experience
          </li>
        </ul>
      </div>
    ),

    stacks: ['nextjs', 'vercel', 'supabase'],
    git: 'https://github.com/hongchan88/Netflix_Noogle_searchMovie',
    live: 'https://netflix-noogle-search-movie.vercel.app/',
  },
  {
    title: 'Simple API Service',
    timelineYear: '2021',
    link: 'https://github.com/hongchan88/Simple_API_ExpressJs',
    imgUrl: [
      'https://res.cloudinary.com/dwbsxpk82/image/upload/v1636459646/portfolio/fkdoj7cza7aol9nnpqpq.png',
    ],

    description: (
      <div>
        <h3 className='font-semibold mb-1'>
          RESTful API with Node.js & Express
        </h3>
        <ul className='list-disc list-inside ml-4 space-y-1'>
          <li>
            Built a RESTful API using <strong>Node.js</strong> and{' '}
            <strong>Express</strong>
          </li>
          <li>
            Followed <strong>MVC architecture</strong> to ensure clean and
            scalable code structure
          </li>
          <li>
            Integrated <strong>Jest</strong> for unit testing
          </li>
          <li>
            Used <strong>Postman</strong> for endpoint validation and debugging
          </li>
        </ul>
      </div>
    ),
    stacks: ['nodejs', 'expressjs', 'jest', 'postman'],
    git: 'https://github.com/hongchan88/Simple_API_ExpressJs',
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

  '3djs': {
    url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
    desc: 'Three.js',
  },
  AWS: {
    url: 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-ar21.svg',
    desc: 'Amazon Web Services',
  },
  GSAP: {
    url: '/projects/logo/gsap.svg',
    desc: 'GreenSock Animation Platform',
  },
  blender: {
    url: 'https://www.vectorlogo.zone/logos/blender/blender-ar21.svg',
    desc: 'Blender',
  },
  python: {
    url: 'https://cdn.jsdelivr.net/npm/@programming-languages-logos/python@0.0.0/python.svg',
    desc: 'Python',
  },
  retool: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Retool_logo.svg',
    desc: 'Retool',
  },
  'segment.io': {
    url: 'https://www.vectorlogo.zone/logos/segment/segment-ar21.svg',
    desc: 'Segment.io',
  },
  typescript: {
    url: 'https://cdn.jsdelivr.net/npm/programming-languages-logos@0.0.3/src/typescript/typescript.svg',
    desc: 'TypeScript',
  },
};

export const aboutMe = {};
