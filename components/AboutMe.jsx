export default function AboutMe() {
  return (
    <section id='aboutme' className='bg-white dark:bg-gray-800'>
      <div className='max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800'>
        <h1 className=' text-5xl md:text-9xl font-bold py-20 text-center md:text-left'>
          About Me.
        </h1>
      </div>
      <div className='bg-[#F1F1F1] -mt-10 dark:bg-gray-900'>
        <div className='text-container max-w-6xl mx-auto pt-20'>
          <p
            className='leading-loose text-2xl md:text-4xl font-semibold  mx-4'
            style={{ lineHeight: '3rem' }}
          >
            I'm a software developer who loves building products and web
            applications that impact millions of lives.
          </p>
        </div>
      </div>
      <div className='bg-[#F1F1F1] dark:bg-gray-900 px-4'>
        <div className='pt-20 grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-y-20 gap-x-20'>
          {/* Social Buttons */}
          <div className='inline-flex flex-col'>
            <div>
              <h1 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
                Contact
              </h1>
              <p className='text-lg text-gray-500 mt-4 dark:text-gray-300'>
                For any sort help / enquiry,{' '}
                <a
                  href={`/contact`}
                  className='text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300'
                >
                  contact
                </a>{' '}
                me and I'll get back.
              </p>
            </div>
            <div className='mt-8'>
              <h1 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
                Job Opportunities
              </h1>
              <p className='text-lg text-gray-500 mt-4 dark:text-gray-300'>
                I'm currently looking for a job, If you see me as a good fit for
                your company, you may{' '}
                <a
                  href={'/contact'}
                  className='text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300'
                >
                  contact
                </a>{' '}
                me . I'd love to be a part of your company.
              </p>
            </div>
          </div>

          <div className='col-span-1 md:col-span-2'>
            <p className='text-xl text-gray-700 mb-4 dark:text-gray-300 '>
              Hello! I'm Hong and I'm passionate about technology and dedicated
              to lifelong learning. As a web developer, I'm constantly seeking
              out new ways to make people's lives easier.
            </p>
            <p className='text-xl text-gray-700 mb-4 dark:text-gray-300 '>
              My journey began with a Diploma of Website Development course at
              TAFE, which provided me with a strong foundation in the basics of
              becoming a developer. In my current role, I'm a JavaScript
              developer working on frontend components in ReactJS/NextJs and
              SCSS modules. As a small team member of the dev team, I've had the
              opportunity to expand my knowledge of back-end development and
              encounter many new tasks. My experience working at the airport has
              taught me to be adaptable and thrive in a fast-paced environment.
              I primarily use NextJS and SCSS module to connect with GraphQL API
              from AWS AppSync. Additionally, I've gained experience in
              implementing Segment.io API to connect with Amplitude, Google
              Analytics, Mailchimp, and Klaviyo. I love working with new
              technologies and exploring new ways to solve complex problems.
            </p>
            <p className='text-xl text-gray-700 mb-4 dark:text-gray-300 '>
              Currently, I'm diving into object-oriented programming with
              TypeScript, among other things. I'm a fast learner and creative
              problem-solver, and I pride myself on my ability to thrive in any
              environment. If you're looking for someone who's passionate about
              using technology to solve real-world problems and who never stops
              learning, let's connect! Here are a few technologies I've been
              taught myself along the journey :
            </p>

            <h1 className='bg-red-500 text-3xl rounded-md px-2 py-1 inline-block font-bold text-gray-50'>
              Tech Stack
            </h1>
            <div className='flex flex-row flex-wrap mt-8'>
              <img
                title='HTML5'
                src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='CSS3'
                src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='tailwind'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='JavaScript'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
              />
              <img
                title='ReacJS'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg'
              />

              <img
                title='TypeScript'
                src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/typescript/typescript.png'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='Express.js'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original-wordmark.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='Node.js'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='GraphQL'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />

              <img
                title='Firebase'
                src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/firebase/firebase.png'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='MySQL'
                src='https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/mysql/mysql.png'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='Next.js'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='jest'
                src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='Prisma'
                src='img/prisma.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
              <img
                title='Apollo'
                src='https://www.vectorlogo.zone/logos/apollographql/apollographql-icon.svg'
                className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
