import { SOCIALS } from './contact.constants';

export default function SocialLinks() {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {SOCIALS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target={label === 'Email' ? undefined : '_blank'}
          rel={label === 'Email' ? undefined : 'noreferrer'}
          className="contact-social group flex items-center gap-2 rounded-lg border border-white/10 bg-white/2 px-5 py-3 font-mono text-xs uppercase tracking-widest text-gray-300 transition-colors duration-200 hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 hover:text-[#00D4FF]"
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
          {label}
        </a>
      ))}
    </div>
  );
}
