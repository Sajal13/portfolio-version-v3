import { SearchableSelectOption } from '@repo/ui/components';

export const categoryOptions: SearchableSelectOption[] = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'DevOps', value: 'devops' },
  { label: 'Mobile Development', value: 'mobile' },
  { label: 'Database', value: 'database' },
  { label: 'Cloud & Infrastructure', value: 'cloud' },
  { label: 'Testing & QA', value: 'testing' },
  { label: 'UI/UX Design', value: 'ui-ux' },
  { label: 'Programming Languages', value: 'programming-languages' },
  { label: 'AI & Machine Learning', value: 'ai-ml' },
  { label: 'Security', value: 'security' },
  { label: 'Version Control', value: 'version-control' },
  { label: 'API & Architecture', value: 'api-architecture' },
  { label: 'Tools & Productivity', value: 'tools-productivity' },
  { label: 'Data Engineering', value: 'data-engineering' },
  { label: 'Web Performance', value: 'web-performance' },
  { label: 'CMS & Web Platforms', value: 'cms-platforms' },
  { label: 'Networking', value: 'networking' },
  { label: 'Career & Soft Skills', value: 'career-soft-skills' },
  { label: 'Other', value: 'other' }
];

export const parentOptions: SearchableSelectOption[] = [
  { label: 'Programming Languages', value: 'programming-languages' },
  { label: 'Frontend Frameworks & Libraries', value: 'frontend-frameworks' },
  { label: 'CSS Frameworks & Styling', value: 'css-frameworks' },
  { label: 'Backend Frameworks', value: 'backend-frameworks' },
  { label: 'Databases', value: 'databases' },
  { label: 'ORMs & Query Builders', value: 'orm-query-builders' },
  { label: 'State Management', value: 'state-management' },
  { label: 'API & Data Fetching', value: 'api-data-fetching' },
  { label: 'Testing', value: 'testing' },
  { label: 'Build Tools & Bundlers', value: 'build-tools' },
  { label: 'Package Managers', value: 'package-managers' },
  { label: 'Version Control', value: 'version-control' },
  { label: 'DevOps & CI/CD', value: 'devops-cicd' },
  { label: 'Cloud & Hosting', value: 'cloud-hosting' },
  { label: 'Containers & Orchestration', value: 'containers-orchestration' },
  { label: 'Mobile Frameworks', value: 'mobile-frameworks' },
  { label: 'Authentication & Security', value: 'auth-security' },
  { label: 'CMS & Web Platforms', value: 'cms-platforms' },
  { label: 'Design Tools', value: 'design-tools' },
  { label: 'IDEs & Editors', value: 'ides-editors' },
  { label: 'Other Tools', value: 'other-tools' }
];

export const titleOptions: SearchableSelectOption[] = [
  // Languages
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'HTML', value: 'HTML' },
  { label: 'CSS', value: 'CSS' },
  { label: 'Python', value: 'Python' },
  { label: 'PHP', value: 'PHP' },
  { label: 'Ruby', value: 'Ruby' },
  { label: 'Java', value: 'Java' },
  { label: 'C#', value: 'C#' },
  { label: 'Go', value: 'Go' },
  { label: 'Rust', value: 'Rust' },
  { label: 'SQL', value: 'SQL' },

  // Frontend frameworks & libraries
  { label: 'React', value: 'React' },
  { label: 'Next.js', value: 'Next.js' },
  { label: 'Vue.js', value: 'Vue.js' },
  { label: 'Nuxt.js', value: 'Nuxt.js' },
  { label: 'Angular', value: 'Angular' },
  { label: 'Svelte', value: 'Svelte' },
  { label: 'SvelteKit', value: 'SvelteKit' },
  { label: 'SolidJS', value: 'SolidJS' },
  { label: 'Remix', value: 'Remix' },
  { label: 'Astro', value: 'Astro' },
  { label: 'jQuery', value: 'jQuery' },
  { label: 'Alpine.js', value: 'Alpine.js' },
  { label: 'Redux', value: 'Redux' },
  { label: 'Zustand', value: 'Zustand' },
  { label: 'Recoil', value: 'Recoil' },
  { label: 'MobX', value: 'MobX' },
  { label: 'TanStack Query', value: 'TanStack Query' },
  { label: 'React Hook Form', value: 'React Hook Form' },
  { label: 'Formik', value: 'Formik' },
  { label: 'Framer Motion', value: 'Framer Motion' },

  // CSS frameworks & styling
  { label: 'Tailwind CSS', value: 'Tailwind CSS' },
  { label: 'Bootstrap', value: 'Bootstrap' },
  { label: 'Sass / SCSS', value: 'Sass / SCSS' },
  { label: 'Material UI', value: 'Material UI' },
  { label: 'Chakra UI', value: 'Chakra UI' },
  { label: 'Ant Design', value: 'Ant Design' },
  { label: 'shadcn/ui', value: 'shadcn/ui' },
  { label: 'Styled Components', value: 'Styled Components' },
  { label: 'Emotion', value: 'Emotion' },

  // Backend frameworks & runtimes
  { label: 'Node.js', value: 'Node.js' },
  { label: 'Express.js', value: 'Express.js' },
  { label: 'NestJS', value: 'NestJS' },
  { label: 'Fastify', value: 'Fastify' },
  { label: 'Django', value: 'Django' },
  { label: 'Flask', value: 'Flask' },
  { label: 'FastAPI', value: 'FastAPI' },
  { label: 'Laravel', value: 'Laravel' },
  { label: 'Ruby on Rails', value: 'Ruby on Rails' },
  { label: 'Spring Boot', value: 'Spring Boot' },
  { label: 'ASP.NET Core', value: 'ASP.NET Core' },
  { label: 'Deno', value: 'Deno' },
  { label: 'Bun', value: 'Bun' },

  // ORMs / data layer
  { label: 'TypeORM', value: 'TypeORM' },
  { label: 'Prisma', value: 'Prisma' },
  { label: 'Sequelize', value: 'Sequelize' },
  { label: 'Mongoose', value: 'Mongoose' },
  { label: 'Drizzle ORM', value: 'Drizzle ORM' },

  // API / data fetching
  { label: 'REST API', value: 'REST API' },
  { label: 'GraphQL', value: 'GraphQL' },
  { label: 'Apollo Client', value: 'Apollo Client' },
  { label: 'tRPC', value: 'tRPC' },
  { label: 'Socket.IO', value: 'Socket.IO' },
  { label: 'Axios', value: 'Axios' },

  // Testing
  { label: 'Jest', value: 'Jest' },
  { label: 'Vitest', value: 'Vitest' },
  { label: 'Cypress', value: 'Cypress' },
  { label: 'Playwright', value: 'Playwright' },
  { label: 'React Testing Library', value: 'React Testing Library' },

  // Build tools / bundlers
  { label: 'Vite', value: 'Vite' },
  { label: 'Webpack', value: 'Webpack' },
  { label: 'Turborepo', value: 'Turborepo' },
  { label: 'ESLint', value: 'ESLint' },
  { label: 'Prettier', value: 'Prettier' },

  // Databases
  { label: 'PostgreSQL', value: 'PostgreSQL' },
  { label: 'MySQL', value: 'MySQL' },
  { label: 'MongoDB', value: 'MongoDB' },
  { label: 'Redis', value: 'Redis' },
  { label: 'SQLite', value: 'SQLite' },
  { label: 'Firebase', value: 'Firebase' },
  { label: 'Supabase', value: 'Supabase' }
];
