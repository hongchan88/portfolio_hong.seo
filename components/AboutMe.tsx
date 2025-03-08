import { FC } from 'react';
import { stackImages } from '../app/data/data';

const AboutMe: FC = () => {
  return (
    <section id='aboutme' className='bg-white dark:bg-gray-800'>
      <div className='max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800'>
        <h1 className='text-5xl md:text-9xl font-bold py-20 text-center md:text-left'>
          About Me
        </h1>
      </div>
      <div className='bg-[#F1F1F1] -mt-10 dark:bg-gray-900'>
        <div className='text-container max-w-6xl mx-auto pt-20'>
          <p
            className='leading-loose text-2xl md:text-4xl font-semibold mx-4'
            style={{ lineHeight: '3rem' }}
          >
            I am a passionate software developer who thrives on building
            impactful and scalable web applications.
          </p>
        </div>
      </div>
      <div className='bg-[#F1F1F1] dark:bg-gray-900 px-4'>
        <div className='pt-20 grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto gap-y-20 gap-x-20'>
          <div className='inline-flex flex-col'>
            <div>
              <h1 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
                Contact
              </h1>
              <p className='text-lg text-gray-500 mt-4 dark:text-gray-300'>
                Interested in collaborating?{' '}
                <a
                  href='/contact'
                  className='text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300'
                >
                  Get in touch
                </a>{' '}
                and let’s discuss how we can create something great together.
              </p>
            </div>
            <div className='mt-8'>
              <h1 className='text-xl font-semibold text-gray-700 dark:text-gray-200'>
                Opportunities
              </h1>
              <p className='text-lg text-gray-500 mt-4 dark:text-gray-300'>
                Currently seeking new challenges. If you believe I can
                contribute to your team,{' '}
                <a
                  href='/contact'
                  className='text-gray-800 border-b-2 border-gray-800 dark:border-gray-300 font-bold dark:text-gray-300'
                >
                  let’s connect.
                </a>
              </p>
            </div>
          </div>
          <div className='col-span-1 md:col-span-2'>
            <p className='text-xl text-gray-700 mb-4 dark:text-gray-300'>
              My journey started with a diploma in Web Development, giving me a
              solid foundation in modern web technologies. As a JavaScript
              developer, I specialize in crafting frontend experiences with
              React and Next.js while integrating APIs and scalable backend
              services.
            </p>
            <p className='text-xl text-gray-700 mb-4 dark:text-gray-300'>
              I have hands-on experience with tools like GraphQL, AWS AppSync,
              and Segment.io to build data-driven solutions. I'm always eager to
              learn and adopt new technologies to solve real-world problems
              effectively.
            </p>
            <p className='text-xl text-gray-700 mb-4 dark:text-gray-300'>
              Here’s my tech stack:
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
