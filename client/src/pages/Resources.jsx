import Layout from '../components/common/Layout';

const resources = [
  { title: 'JavaScript', description: 'MDN Web Docs and modern JavaScript references.', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { title: 'React', description: 'Official React docs for components, hooks, and routing.', href: 'https://react.dev/' },
  { title: 'Node.js', description: 'Node.js API docs and backend fundamentals.', href: 'https://nodejs.org/en/docs' },
  { title: 'MongoDB', description: 'MongoDB University and schema design resources.', href: 'https://www.mongodb.com/docs/' },
  { title: 'System Design', description: 'Practical architecture learning for interviews.', href: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
  { title: 'DSA Practice', description: 'Problem solving and interview preparation.', href: 'https://leetcode.com/' }
];

const Resources = () => (
  <Layout title="Resources" subtitle="Curated learning links for career prep, interviews, and technical depth.">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <a key={resource.title} href={resource.href} target="_blank" rel="noreferrer" className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)]">
          <div className="text-lg font-semibold text-slate-950">{resource.title}</div>
          <p className="mt-2 text-sm text-slate-600">{resource.description}</p>
          <div className="mt-4 text-sm font-semibold text-blue-600">Open resource →</div>
        </a>
      ))}
    </div>
  </Layout>
);

export default Resources;