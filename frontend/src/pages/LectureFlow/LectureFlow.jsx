import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play, BookOpen, PenTool, Layout, Code, ClipboardList, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function LectureFlow() {
  // Mock data for presentation (usually fetched by ID)
  const lecture = {
    title: 'React Hooks',
    objectives: 'Understand useState and useEffect.',
    introduction: 'Hooks allow functional components to have state.',
    theory: 'State represents the parts of an app that can change. Each component can maintain its own state.',
    examples: 'Counter app, Form inputs.',
    codingDemo: 'const [count, setCount] = useState(0);',
    practice: 'Build a timer using useEffect.',
    assignment: 'Create a fully functional to-do list with state.'
  };

  const slides = [
    { id: 'intro', icon: <BookOpen />, title: 'Introduction', content: lecture.introduction },
    { id: 'objectives', icon: <Play />, title: 'Objectives', content: lecture.objectives },
    { id: 'theory', icon: <Book />, title: 'Theory', content: lecture.theory },
    { id: 'examples', icon: <Layout />, title: 'Examples', content: lecture.examples },
    { id: 'demo', icon: <Code />, title: 'Coding Demo', content: lecture.codingDemo },
    { id: 'practice', icon: <PenTool />, title: 'Practice', content: lecture.practice },
    { id: 'assignment', icon: <ClipboardList />, title: 'Assignment', content: lecture.assignment }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
      if (e.key === 'ArrowLeft' && currentSlide > 0) setCurrentSlide(c => c - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col"
>
      <header className="flex justify-between items-center px-8 py-6 border-b border-[#222]"
>
        <div className="flex items-center gap-4"
>
          <Link to="/dashboard" className="text-[#7C7A7A] hover:text-white transition-colors"><X size={28}/></Link>
          <h1 className="text-2xl font-bold text-white">{lecture.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-[#7C7A7A] text-sm font-medium"
>
          {currentSlide + 1} / {slides.length}
        </div>
      </header>

      <main className="flex-1 relative flex items-center justify-center overflow-hidden p-12"
>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl w-full"
          >
            <div className="flex items-center gap-4 text-[#FF5D73] mb-8"
>
              {slides[currentSlide].icon}
              <h2 className="text-4xl font-bold">{slides[currentSlide].title}</h2>
            </div>
            <div className="text-[#FFFFFF] text-2xl leading-relaxed whitespace-pre-wrap"
>
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="flex justify-between px-12 py-8"
>
        <button 
          onClick={() => setCurrentSlide(c => Math.max(0, c - 1))}
          disabled={currentSlide === 0}
          className="flex items-center gap-2 px-6 py-3 bg-[#141414] hover:bg-[#222] text-white rounded-xl disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={24}/> Previous
        </button>
        <button 
          onClick={() => setCurrentSlide(c => Math.min(slides.length - 1, c + 1))}
          disabled={currentSlide === slides.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF5D73] hover:bg-[#ff405b] text-white rounded-xl disabled:opacity-30 transition-colors"
        >
          Next <ChevronRight size={24}/>
        </button>
      </footer>
    </div>
  );
}
