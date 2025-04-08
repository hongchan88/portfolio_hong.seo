import { getStackImg } from '../../app/utils/getStackImage';
interface ProjectInfoProps {
  title: string;
  info: string;
  stacks: string[];
  git?: string;
  live?: string;
}

const ProjectInfo = ({ title, info, stacks, git, live }: ProjectInfoProps) => {
  return (
    <div className='w-full px-5 py-1'>
      <div className='relative'>
        <div className='absolute w-full left-0 -top-14'>
          <div className='flex justify-between mb-5'>
            <div className='flex'>
              {' '}
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
            {stacks.map((stack) => {
              const stackInfo = getStackImg(stack);
              return (
                <img
                  key={stack}
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
export default ProjectInfo;
