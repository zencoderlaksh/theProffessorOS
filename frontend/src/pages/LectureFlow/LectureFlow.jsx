import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, X, Play, BookOpen, PenTool, Code, 
  Sparkles, Maximize2, Minimize2, MessageSquare, Layers, FileText, CheckCircle2, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function LectureFlow() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [deck, setDeck] = useState(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
      if (res.data.length > 0) {
        setSelectedCourseId(res.data[0]._id);
        if (res.data[0].lessons && res.data[0].lessons.length > 0) {
          setLessons(res.data[0].lessons);
          setSelectedLessonId(res.data[0].lessons[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourseId(courseId);
    const course = courses.find(c => c._id === courseId);
    if (course && course.lessons && course.lessons.length > 0) {
      setLessons(course.lessons);
      setSelectedLessonId(course.lessons[0]._id);
    } else {
      setLessons([]);
      setSelectedLessonId('');
    }
  };

  const handleGenerateSlides = async () => {
    if (!selectedLessonId) return;

    setIsGenerating(true);
    setGenerationStep('Extracting document text...');

    try {
      setTimeout(() => setGenerationStep('Analyzing key concepts with AI...'), 1200);
      setTimeout(() => setGenerationStep('Structuring presentation slides...'), 2400);

      const res = await axios.post('http://localhost:5000/api/lectures/generate-slides', {
        lessonId: selectedLessonId
      });

      setDeck(res.data.deck);
      setCurrentSlideIndex(0);
    } catch (err) {
      console.error('Slide generation error:', err);
      alert(err.response?.data?.error || 'Failed to generate presentation slides.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!deck || !deck.slides) return;
      if ((e.key === 'ArrowRight' || e.key === ' ') && currentSlideIndex < deck.slides.length - 1) {
        setCurrentSlideIndex(prev => prev + 1);
      }
      if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, deck]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
        setIsFullscreen(false);
      }
    }
  };

  const currentSlide = deck?.slides?.[currentSlideIndex];

  return (
    <div className={`min-h-screen bg-[#050505] text-white flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 p-0' : 'p-8 max-w-7xl mx-auto'}`}>
      
      {/* Top Header / Selector Bar */}
      {!isFullscreen && (
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
              <PresentationIcon className="text-[#FF5D73]" />
              Lecture Flow
            </h1>
            <p className="text-[#7C7A7A] text-sm mt-1">Transform uploaded course documents into AI-generated presentation decks</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-[#0a0a0a] p-3 rounded-2xl border border-[#222] w-full md:w-auto">
            {/* Course Selector */}
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="bg-[#141414] border border-[#333] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#FF5D73]"
            >
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
              {courses.length === 0 && <option value="">No Courses Available</option>}
            </select>

            {/* Lesson Selector */}
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="bg-[#141414] border border-[#333] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#FF5D73] max-w-[200px] truncate"
            >
              {lessons.map(l => (
                <option key={l._id} value={l._id}>{l.title}</option>
              ))}
              {lessons.length === 0 && <option value="">No Lessons in Course</option>}
            </select>

            {/* Generate Button */}
            <button
              onClick={handleGenerateSlides}
              disabled={isGenerating || !selectedLessonId}
              className="px-5 py-2 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-xs rounded-xl transition-all shadow-lg shadow-[#FF5D73]/20 flex items-center gap-2 disabled:opacity-40"
            >
              <Sparkles size={14} />
              {isGenerating ? 'Generating...' : 'Generate AI Slide Deck'}
            </button>
          </div>
        </header>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 glass-panel rounded-3xl border border-[#222] min-h-[500px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-16 h-16 border-4 border-[#FF5D73]/20 border-t-[#FF5D73] rounded-full mb-6"
          />
          <h3 className="text-xl font-bold mb-2">Creating Presentation Deck</h3>
          <p className="text-[#7C7A7A] text-sm font-mono animate-pulse">{generationStep}</p>
        </div>
      )}

      {/* Slide Presentation Mode */}
      {!isGenerating && deck && deck.slides && (
        <div className="flex-1 flex flex-col glass-panel rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl overflow-hidden relative">
          
          {/* Slide Top Bar */}
          <div className="flex justify-between items-center px-8 py-4 border-b border-[#222] bg-[#0d0d0d]">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">
                {deck.deckTitle || 'Lecture Presentation'}
              </span>
              <span className="text-xs text-[#555] font-mono">
                Slide {currentSlideIndex + 1} of {deck.slides.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  showSpeakerNotes
                    ? 'bg-[#FF5D73] text-white border-[#FF5D73]'
                    : 'bg-[#141414] text-[#A0A0A0] border-[#333] hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                Speaker Notes
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-[#141414] border border-[#333] text-[#A0A0A0] hover:text-white transition-colors"
                title="Toggle Fullscreen Mode"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#1e1e1e] h-1">
            <motion.div
              className="bg-[#FF5D73] h-1"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlideIndex + 1) / deck.slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Main Slide Content Canvas */}
          <div className="flex-1 p-8 lg:p-12 overflow-y-auto flex flex-col justify-between custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.25 }}
                className="max-w-5xl mx-auto w-full space-y-6"
              >
                {/* Slide Type Header */}
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/30">
                    <SlideIcon type={currentSlide?.type} />
                  </span>
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
                      {currentSlide?.title}
                    </h2>
                    {currentSlide?.subtitle && (
                      <p className="text-base text-[#FF5D73] font-medium mt-1">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bullets List */}
                {currentSlide?.bullets && currentSlide.bullets.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {currentSlide.bullets.map((bullet, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-[#141414] border border-[#222] hover:border-[#FF5D73]/30 transition-all"
                      >
                        <CheckCircle2 size={18} className="text-[#FF5D73] shrink-0 mt-0.5" />
                        <span className="text-sm text-[#E0E0E0] font-medium leading-relaxed">
                          {bullet}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Code Snippet Box */}
                {currentSlide?.codeSnippet && (
                  <div className="rounded-2xl border border-[#222] bg-[#000000] overflow-hidden relative shadow-inner my-4">
                    <div className="flex justify-between items-center px-4 py-2 bg-[#111111] border-b border-[#222]">
                      <span className="text-xs font-mono text-[#7C7A7A] flex items-center gap-2">
                        <Code size={14} className="text-[#FF5D73]" /> Code Example
                      </span>
                      <button
                        onClick={() => copyCode(currentSlide.codeSnippet)}
                        className="text-xs text-[#7C7A7A] hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copiedCode ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-5 text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                      <code>{currentSlide.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Explanation */}
                {currentSlide?.explanation && (
                  <div className="p-5 rounded-2xl bg-[#121212] border border-[#222] text-sm text-[#A0A0A0] leading-relaxed">
                    <h4 className="text-xs uppercase font-semibold tracking-wider text-[#7C7A7A] mb-2">
                      Deep Dive Explanation
                    </h4>
                    <p>{currentSlide.explanation}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Speaker Notes Drawer */}
          {showSpeakerNotes && currentSlide?.speakerNotes && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-8 py-4 bg-[#141414] border-t border-[#FF5D73]/30 text-xs text-[#FF5D73] font-medium flex items-center gap-3"
            >
              <MessageSquare size={16} className="shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider block text-[10px] text-[#A0A0A0]">Professor Talking Points</span>
                {currentSlide.speakerNotes}
              </div>
            </motion.div>
          )}

          {/* Footer Controls */}
          <div className="flex justify-between items-center px-8 py-5 border-t border-[#222] bg-[#0d0d0d]">
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[#141414] hover:bg-[#222] text-white rounded-xl text-xs font-semibold disabled:opacity-30 transition-all border border-[#222]"
            >
              <ChevronLeft size={18} /> Previous Slide
            </button>

            <div className="text-xs text-[#555] font-mono hidden md:block">
              Use <kbd className="px-2 py-1 bg-[#1a1a1a] rounded border border-[#333] text-white">←</kbd> <kbd className="px-2 py-1 bg-[#1a1a1a] rounded border border-[#333] text-white">→</kbd> Arrow Keys to Navigate
            </div>

            <button
              onClick={() => setCurrentSlideIndex(prev => Math.min(deck.slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === deck.slides.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 text-white rounded-xl text-xs font-semibold disabled:opacity-30 transition-all shadow-lg shadow-[#FF5D73]/20"
            >
              Next Slide <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Empty State when no deck generated yet */}
      {!isGenerating && !deck && (
        <div className="flex-1 flex flex-col items-center justify-center p-12 glass-panel rounded-3xl border border-[#222] text-center min-h-[500px]">
          <div className="p-5 rounded-2xl bg-[#141414] border border-[#333] text-[#FF5D73] mb-4">
            <PresentationIcon />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ready to Deliver Your Lecture?</h2>
          <p className="text-[#7C7A7A] text-sm max-w-md mb-6">
            Select a Course and an uploaded Lesson document from the bar above, then click <strong>"Generate AI Slide Deck"</strong> to create presentation slides automatically.
          </p>
          <button
            onClick={handleGenerateSlides}
            disabled={!selectedLessonId}
            className="px-6 py-3 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#FF5D73]/25 flex items-center gap-2 disabled:opacity-40"
          >
            <Sparkles size={18} /> Generate AI Presentation Deck
          </button>
        </div>
      )}
    </div>
  );
}

function PresentationIcon({ className = "w-8 h-8" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12H4z" />
    </svg>
  );
}

function SlideIcon({ type }) {
  switch (type) {
    case 'code':
      return <Code size={24} />;
    case 'theory':
      return <BookOpen size={24} />;
    case 'summary':
      return <CheckCircle2 size={24} />;
    case 'points':
      return <Layers size={24} />;
    default:
      return <Play size={24} />;
  }
}
