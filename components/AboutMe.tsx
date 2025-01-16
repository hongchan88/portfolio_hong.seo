import { FC } from 'react';
import { stackImages } from '../app/data/data';

const AboutMe: FC = () => {
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
              {Object.values(stackImages).map((stack) => {
                return (
                  <img
                    title={stack.desc}
                    src={stack.url}
                    className='h-20 w-20 mx-4 my-4 dark:bg-white rounded-lg'
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
