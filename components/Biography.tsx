// Text equivalent of public/aboutme/aboutMeFill.webp. Keep artwork and HTML in sync.
export default function Biography({ className = '' }: { className?: string }) {
  return (
    <section className={className} aria-labelledby='biography-heading'>
      <h2 id='biography-heading' className='text-3xl font-bold mb-6'>
        About me
      </h2>
      <div className='space-y-4'>
        <p>
          Adaptable developer with 3+ years of startup experience across diverse
          tech stacks and real-world challenges.
        </p>
        <p>
          Skilled developer who embraces AI to boost productivity, backed by
          strong coding fundamentals and hands-on experience.
        </p>
        <p>
          Passionate about learning new things and tackling challenging problems
          with a growth mindset.
        </p>
      </div>
      <h3 className='text-xl font-bold mt-6 mb-3'>Skills</h3>
      <ul className='list-disc list-inside'>
        <li>HTML and SCSS</li>
        <li>JavaScript and TypeScript</li>
        <li>React and Next.js</li>
        <li>Retool</li>
        <li>Python</li>
      </ul>
    </section>
  );
}
