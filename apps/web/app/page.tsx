import { ScrollTriggerRefresher } from 'components/common/ScrollTriggerRefresher';
import BlogsSection from 'components/pages/blogs/BlogSection';
import ContactSection from 'components/pages/contact';
import ExperienceSection from 'components/pages/experiences';
import HeroSection from 'components/pages/home';
import PortfolioSection from 'components/pages/portfolio';
import SkillsSection from 'components/pages/skills';
import TestimonialsSection from 'components/pages/testimonial';

export default function Home() {
  return (
    <div className="">
      <ScrollTriggerRefresher />
      <HeroSection />
      <SkillsSection />
      <PortfolioSection />
      <ExperienceSection />
      <TestimonialsSection />
      <BlogsSection />
      <ContactSection />
    </div>
  );
}
