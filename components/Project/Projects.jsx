import { projectsData } from '../../app/data/data';
import ProjectImage from './ProjectImage';
import ProjectInfo from './ProjectInfo';
export default function Projects() {
  return (
    <section id='projects' className='bg-white dark:bg-gray-800'>
      <div className='max-w-6xl mx-auto h-48 bg-white dark:bg-gray-800'>
        <h1 className=' text-5xl md:text-9xl font-bold py-20 text-center md:text-left'>
          Projects
        </h1>
      </div>
      {/* Grid starts here */}
      <div className='bg-[#F1F1F1] dark:bg-gray-900'>
        {projectsData?.map((proj, idx) => (
          <div className='max-w-6xl mx-auto gap-20 py-10 pb-20'>
            <div className='flex mt-14'>
              <ProjectImage
                title={proj.title}
                link={proj.link}
                imgUrl={proj.imgUrl}
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
