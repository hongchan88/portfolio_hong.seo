type ProjectImageProps = {
  title: string;
  link: string;
  imgUrl: string;
};

const ProjectImage = ({ title, link, imgUrl }: ProjectImageProps) => {
  return (
    <a href={link} className='hidden md:block w-full shadow-2xl'>
      <div className='relative overflow-hidden'>
        <div className='h-72 object-cover'>
          <img
            src={imgUrl}
            alt='portfolio'
            className='transform hover:scale-125 transition duration-2000 ease-out object-contain h-full w-full'
          />
        </div>
        <h1 className='absolute top-10 left-10 text-gray-50 font-bold text-xl bg-red-500 rounded-md px-2'>
          {title}
        </h1>
      </div>
    </a>
  );
};

export default ProjectImage;
