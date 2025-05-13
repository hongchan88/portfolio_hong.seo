import { useState } from 'react';
import { getStackImg } from '../../app/utils/getStackImage';
import Image from 'next/image';
interface ProjectInfoProps {
  stacks: string[];
  git?: string;
  live?: string;
}

const ProjectInfo = ({ stacks }: ProjectInfoProps) => {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className='w-full py-1'>
      <div className='flex flex-col justify-between h-full mt-10'>
        <div className='flex-col'>
          <div className='flex justify-between items-center'>
            <h1 className='bg-red-500 text-xl rounded-md px-2 py-1 inline-block font-bold text-gray-50'>
              Tech Stack Used
            </h1>
          </div>
          <div className='flex flex-wrap'>
            {stacks.map((stack) => {
              const stackInfo = getStackImg(stack);
              const isHovered = hovered === stack;

              return (
                <div
                  key={stack}
                  className='h-14 w-14 mx-4 my-4 flex items-center justify-center dark:bg-white rounded-lg cursor-pointer'
                  onMouseEnter={() => setHovered(stack)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {isHovered ? (
                    <p className='text-sm text-center'>{stackInfo.desc}</p>
                  ) : (
                    <Image
                      width={56}
                      height={56}
                      src={stackInfo.url}
                      title={stackInfo.desc}
                      alt={stackInfo.desc}
                      className='object-contain'
                      loading='lazy'
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProjectInfo;
