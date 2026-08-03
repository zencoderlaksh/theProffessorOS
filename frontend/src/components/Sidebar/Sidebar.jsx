import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Presentation, Database, ClipboardList, 
  HelpCircle, Folder, ChevronRight, FileText, TrendingUp, Cpu, Menu, X, LogOut, User 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('prof_admin_user');
    if (savedUser) {
      try {
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {
        setAdminUser({ name: 'Lakshya Yadav', email: 'yadavlakshya86@gmail.com' });
      }
    } else {
      setAdminUser({ name: 'Lakshya Yadav', email: 'yadavlakshya86@gmail.com' });
    }
  }, []);

  const links = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/lesson-builder', name: 'Lesson Builder', icon: <BookOpen size={20} /> },
    { path: '/lecture-flow', name: 'Lecture Flow', icon: <Presentation size={20} /> },
    { path: '/example-repository', name: 'Knowledge Base', icon: <Database size={20} /> },
    { path: '/assignment-builder', name: 'Assignment Builder', icon: <ClipboardList size={20} /> },
    { path: '/question-bank', name: 'Question Bank', icon: <HelpCircle size={20} /> },
    { path: '/personal-growth', name: 'Personal Growth', icon: <TrendingUp size={20} /> },
    { path: '/discovery', name: 'AI & Tech Radar', icon: <Cpu size={20} /> },
  ];

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses for sidebar:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
    const handleCourseAdded = () => fetchCourses();
    window.addEventListener('courseAdded', handleCourseAdded);
    return () => window.removeEventListener('courseAdded', handleCourseAdded);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleCourse = (courseId) => {
    setExpandedCourse(prev => prev === courseId ? null : courseId);
  };

  const handleLogout = () => {
    localStorage.removeItem('prof_admin_token');
    localStorage.removeItem('prof_admin_user');
    navigate('/login');
  };

  return (
    <>
      {/* MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#222] z-40 px-4 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg tracking-tight flex items-center gap-2">
          <BookOpen className="text-[#FF5D73]" size={22} /> ProfessorOS
        </Link>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-white bg-[#141414] border border-[#333] rounded-xl hover:bg-[#1e1e1e] transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* BACKDROP OVERLAY FOR MOBILE */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR CONTAINER (Persistent on desktop, drawer on mobile) */}
      <aside
        className={`w-64 bg-[#0a0a0a] border-r border-[#222] h-screen fixed left-0 top-0 p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo */}
          <div className="mb-8 text-white font-bold text-2xl tracking-tight flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="text-[#FF5D73]" /> ProfessorOS
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden text-[#7C7A7A] hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5 mb-8">
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

          {/* Dynamic Courses Section */}
          <div className="pt-4 border-t border-[#222] mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-[#555] uppercase tracking-wider px-2 mb-3">
              <span>My Courses</span>
              <span className="bg-[#1e1e1e] text-[#7C7A7A] px-2 py-0.5 rounded-full text-[10px]">
                {courses.length}
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#555]">
                No courses added yet. Upload files in Lesson Builder!
              </div>
            ) : (
              <div className="space-y-1">
                {courses.map((course) => {
                  const isExpanded = expandedCourse === course._id;
                  const lessonCount = course.lessons ? course.lessons.length : 0;

                  return (
                    <div key={course._id} className="rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleCourse(course._id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#141414] rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Folder size={16} className="text-[#FF5D73] shrink-0" />
                          <span className="truncate font-medium text-xs">{course.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {lessonCount > 0 && (
                            <span className="text-[10px] bg-[#1a1a1a] border border-[#333] text-[#7C7A7A] px-1.5 py-0.5 rounded-md">
                              {lessonCount}
                            </span>
                          )}
                          <ChevronRight
                            size={14}
                            className={`transition-transform duration-200 text-[#555] group-hover:text-white ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Expandable Lessons */}
                      {isExpanded && course.lessons && course.lessons.length > 0 && (
                        <div className="pl-6 pr-2 py-1 space-y-1 bg-[#0d0d0d] rounded-b-lg border-l border-[#222] my-1 ml-4">
                          {course.lessons.map((lesson) => (
                            <a
                              key={lesson._id}
                              href={`http://localhost:5000${lesson.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 py-1.5 px-2 text-[11px] text-[#888] hover:text-[#FF5D73] truncate transition-colors"
                              title={lesson.title}
                            >
                              <FileText size={12} className="shrink-0" />
                              <span className="truncate">{lesson.title}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Admin Profile & Logout Footer */}
        <div className="pt-4 border-t border-[#222]">
          <div className="flex items-center justify-between bg-[#141414] p-3 rounded-2xl border border-[#222]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#FF5D73]/20 border border-[#FF5D73]/30 flex items-center justify-center text-[#FF5D73] font-bold text-xs shrink-0">
                LY
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Lakshya Yadav</div>
                <div className="text-[10px] text-[#7C7A7A] truncate">Admin Professor</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-[#7C7A7A] hover:text-red-400 hover:bg-[#1e1e1e] rounded-lg transition-colors shrink-0"
              title="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
