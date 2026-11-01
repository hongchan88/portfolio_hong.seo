const sections = [
  {
    title: '① Full-Stack & 3D',
    text: 'Full-stack developer with 5+ years of experience building web applications, interactive 3D dashboards, and practical business tools with React, Next.js, TypeScript, and Python.',
    top: '51.6%',
  },
  {
    title: '② AI & Automation',
    text: 'I use AI coding tools and n8n to streamline development and automate workflows, with hands-on experience in newsletter automation and API integrations.',
    top: '67.4%',
  },
  {
    title: '③ What Drives Me',
    text: 'I enjoy exploring new technologies and turning ideas into useful software. My focus is on combining AI with web applications to reduce repetitive work.',
    top: '82.8%',
  },
];

// The animated version overlays only the text column of the original artwork.
// Its original icons, frame, title and profile/skills graphics remain intact.
export default function Biography({ className = '', artwork = false }: { className?: string; artwork?: boolean }) {
  return (
    <section className={artwork ? 'absolute inset-0 text-white font-mono' : className} aria-labelledby='biography-heading'>
      <h2 id='biography-heading' className={artwork ? 'sr-only' : 'text-3xl font-bold mb-6'}>
        About me
      </h2>
      {artwork && <div aria-hidden='true' className='absolute'
        style={{ left: '24.4%', right: '9%', top: '51.4%', bottom: '3.4%', backgroundColor: '#0e4683' }} />}
      <div className={artwork ? '' : 'space-y-8'}>
        {sections.map(section => (
          <div key={section.title} className={artwork ? 'absolute' : ''}
            style={artwork ? { left: '27%', right: '9%', top: section.top } : undefined}>
            <h3 className={artwork ? 'font-bold' : 'text-xl font-bold mb-3'}
              style={artwork ? { fontSize: '3.2cqw', lineHeight: 1.35, marginBottom: '.8cqw' } : undefined}>
              {section.title}
            </h3>
            <p className={artwork ? '' : 'leading-relaxed'}
              style={artwork ? { fontSize: '3.1cqw', lineHeight: 1.35 } : undefined}>
              {section.text}
            </p>
          </div>
        ))}
      </div>
      <div className={artwork ? 'sr-only' : ''}>
      <h3 className='text-xl font-bold mt-6 mb-3'>Skills</h3>
      <ul className='list-disc list-inside'>
        <li>HTML and SCSS</li>
        <li>JavaScript and TypeScript</li>
        <li>React and Next.js</li>
        <li>Retool</li>
        <li>Python</li>
      </ul>
      </div>
    </section>
  );
}
