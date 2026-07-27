import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Presentation, Database, ClipboardList, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const links = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/lesson-builder', name: 'Lesson Builder', icon: <BookOpen size={20} /> },
    { path: '/lecture-flow', name: 'Lecture Flow', icon: <Presentation size={20} /> },
    { path: '/example-repository', name: 'Knowledge Base', icon: <Database size={20} /> },
    { path: '/assignment-builder', name: 'Assignment Builder', icon: <ClipboardList size={20} /> },
    { path: '/question-bank', name: 'Question Bank', icon: <HelpCircle size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#222] h-screen fixed left-0 top-0 p-6 flex flex-col"
>
      <div className="mb-10 text-white font-bold text-2xl tracking-tight flex items-center gap-2"
>
        <BookOpen className="text-[#FF5D73]" /> ProfessorOS
      </div>
      <nav className="flex-1 flex flex-col gap-2"
>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname.startsWith(link.path)
                ? 'bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20'
                : 'text-[#7C7A7A] hover:text-white hover:bg-[#141414]'
            }`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
