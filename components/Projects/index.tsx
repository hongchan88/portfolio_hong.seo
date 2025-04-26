import { FC } from 'react';
import { ContainerTextFlip } from '../ContainerTextFlip';
import { Timeline } from '../Timeline/Timeline';

interface indexProps {}

const Projects: FC<indexProps> = ({}) => {
  return (
    <section
      className='projects-section'
      style={{
        height: '100%',
        marginTop: '-100vh',
        // background: 'linear-gradient(to bottom, rgba(177,204,112,0.2) 50%)',
      }}
    >
      <div className='max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10'>
        <div className='text-5xl font-light text-left font-rubik text-neutral-700 dark:text-neutral-300'>
          I enjoy building{' '}
          <ContainerTextFlip
            words={[
              'awesome projects',
              'creative ideas',
              'smart tools',
              'amazing experiences',
            ]}
            className='inline-flex items-baseline'
            textClassName='text-primary-500 font-semibold'
            interval={1500}
            animationDuration={600}
          />{' '}
        </div>
        <h2 className='text-3xl md:text-4xl font-bold font-rubik mt-10 text-left text-black dark:text-white max-w-4xl'>
          Some things I’ve worked on
        </h2>
      </div>
      <Timeline />
    </section>
  );
};

export default Projects;
