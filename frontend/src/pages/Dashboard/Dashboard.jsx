import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Clock, Pin, Edit3, PlayCircle, PlusCircle, Code, Database, 
  BookOpen, FileText, Calendar, CloudLightning, CheckSquare, Square, 
  Plus, TrendingUp, Cpu, ClipboardList, HelpCircle, ArrowRight, Folder, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalAssignments: 0,
    totalExamples: 0,
    recentLessons: [],
    recentAssignments: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(null);

  // Professor's Daily Checklist State
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('professor_todos');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, text: 'Review & grade MERN assignment submissions', done: false },
      { id: 2, text: 'Prepare slide deck for tomorrow\'s Data Structures lecture', done: true },
      { id: 3, text: 'Check latest AI breakthrough tools in AI Radar', done: false },
      { id: 4, text: 'Upload new reference PDF in Lesson Builder', done: false }
    ];
  });
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    localStorage.setItem('professor_todos', JSON.stringify(todos));
  }, [todos]);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodoText.trim(), done: false }]);
    setNewTodoText('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (q.trim().length > 2) {
      setIsSearching(true);
      try {
        const res = await axios.post('http://localhost:5000/api/search/semantic', { query: q });
        setSearchResults(res.data.results || []);
      } catch (err) {
        console.error('Semantic search error', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAskAI = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 2) {
      setIsSearching(true);
      setAiAnswer(null);
      setSearchResults([]);
      try {
        const res = await axios.post('http://localhost:5000/api/search/ask', { query: searchQuery });
        setAiAnswer(res.data.answer);
        setSearchResults(res.data.sources || []);
      } catch (err) {
        console.error('Ask AI error', err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 max-w-7xl mx-auto text-white space-y-8">
      {/* Top Banner Greeting */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#222]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF5D73] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5D73] animate-ping" /> Professor Dashboard
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome back, Professor! 🎓
          </h1>
          <p className="text-sm text-[#7C7A7A] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="flex items-center bg-[#0a0a0a] border border-[#333] focus-within:border-[#FF5D73] rounded-2xl px-4 py-3 transition-all shadow-lg">
            <Search size={18} className="text-[#7C7A7A] mr-3 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleAskAI}
              placeholder="Search across courses or Ask AI (Press Enter)..."
              className="bg-transparent border-none outline-none text-white w-full placeholder-[#555] text-xs font-medium"
            />
          </div>

          {/* AI Answer & Search Results Modal Popup */}
          {(isSearching || aiAnswer || searchResults.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-2xl z-50 p-6 max-h-[30rem] overflow-y-auto custom-scrollbar">
              {isSearching ? (
                <div className="text-xs text-[#7C7A7A] text-center flex justify-center items-center gap-2 py-4">
                  <CloudLightning className="animate-pulse text-[#FF5D73]" size={18} /> Scanning Knowledge Base...
                </div>
              ) : (
                <div className="space-y-4">
                  {aiAnswer && (
                    <div className="pb-4 border-b border-[#222]">
                      <h3 className="text-xs font-semibold text-[#FF5D73] uppercase tracking-wider mb-2">AI Response</h3>
                      <p className="text-xs text-[#E0E0E0] leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold text-[#7C7A7A] uppercase tracking-wider mb-2">Matching Sources</h3>
                      <div className="space-y-2">
                        {searchResults.map((result, idx) => (
                          <div key={idx} className="p-3 border border-[#222] rounded-xl bg-[#141414]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FF5D73]/10 text-[#FF5D73]">
                                {result.type}
                              </span>
                              <span className="text-xs text-white font-semibold">{result.title}</span>
                            </div>
                            <p className="text-xs text-[#7C7A7A] line-clamp-2">{result.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Live Real-time Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/40 transition-all">
          <div className="flex items-center justify-between text-[#7C7A7A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Courses</span>
            <Folder size={20} className="text-[#FF5D73]" />
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{stats.totalCourses || 0}</div>
          <span className="text-[11px] text-[#555] mt-2">Custom Course Repositories</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/40 transition-all">
          <div className="flex items-center justify-between text-[#7C7A7A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Lessons</span>
            <BookOpen size={20} className="text-[#FF5D73]" />
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{stats.totalLessons || 0}</div>
          <span className="text-[11px] text-[#555] mt-2">PDFs & Lecture Content</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/40 transition-all">
          <div className="flex items-center justify-between text-[#7C7A7A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Assignments</span>
            <ClipboardList size={20} className="text-[#FF5D73]" />
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{stats.totalAssignments || 0}</div>
          <span className="text-[11px] text-[#555] mt-2">Tests, Labs & Theory</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/40 transition-all">
          <div className="flex items-center justify-between text-[#7C7A7A] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Knowledge Items</span>
            <Database size={20} className="text-[#FF5D73]" />
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight">{stats.totalExamples || 0}</div>
          <span className="text-[11px] text-[#555] mt-2">Examples & AI Analogies</span>
        </div>
      </div>

      {/* Main Grid: Pending Action Items + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Professor's Daily Action Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckSquare size={20} className="text-[#FF5D73]" />
                Today's Action Items & Reminders
              </h2>
              <span className="text-xs text-[#7C7A7A]">
                {todos.filter(t => t.done).length} / {todos.length} Done
              </span>
            </div>

            {/* Todo Input */}
            <form onSubmit={addTodo} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add a new teaching reminder or action item..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="flex-1 bg-[#141414] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#FF5D73] hover:bg-[#ff405b] text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </form>

            {/* Todo List */}
            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {todos.map(todo => (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    todo.done 
                      ? 'bg-[#0f0f0f] border-[#222] opacity-60' 
                      : 'bg-[#141414] border-[#222] hover:border-[#FF5D73]/30'
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <span className={todo.done ? 'text-[#FF5D73]' : 'text-[#555]'}>
                      {todo.done ? <CheckSquare size={18} /> : <Square size={18} />}
                    </span>
                    <span className={`text-xs font-medium ${todo.done ? 'line-through text-[#7C7A7A]' : 'text-white'}`}>
                      {todo.text}
                    </span>
                  </button>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-[#555] hover:text-red-400 text-xs px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launch Tools Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4 border-b border-[#222] pb-3">
              🚀 Quick Workspace Launchers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/lesson-builder" className="p-3.5 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] rounded-2xl flex flex-col items-center text-center transition-all group">
                <BookOpen size={22} className="text-[#FF5D73] mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Lesson Builder</span>
              </Link>

              <Link to="/lecture-flow" className="p-3.5 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] rounded-2xl flex flex-col items-center text-center transition-all group">
                <PlayCircle size={22} className="text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Lecture Flow</span>
              </Link>

              <Link to="/assignment-builder" className="p-3.5 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] rounded-2xl flex flex-col items-center text-center transition-all group">
                <ClipboardList size={22} className="text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Assignments</span>
              </Link>

              <Link to="/personal-growth" className="p-3.5 bg-[#141414] hover:bg-[#1e1e1e] border border-[#222] rounded-2xl flex flex-col items-center text-center transition-all group">
                <TrendingUp size={22} className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Growth Feed</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Real DB Live Recent Activity Feed (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between border-b border-[#222] pb-3">
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-[#FF5D73]" /> Recent Lessons & PDFs
              </span>
              <Link to="/lesson-builder" className="text-xs text-[#FF5D73] hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </Link>
            </h2>

            {stats.recentLessons && stats.recentLessons.length > 0 ? (
              <div className="space-y-3">
                {stats.recentLessons.map(lesson => (
                  <div key={lesson._id} className="p-3.5 bg-[#141414] border border-[#222] rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[200px]">{lesson.title}</div>
                      <div className="text-[10px] text-[#7C7A7A] mt-0.5">
                        Course: {lesson.courseId?.name || 'General'}
                      </div>
                    </div>
                    {lesson.fileUrl && (
                      <a
                        href={`http://localhost:5000${lesson.fileUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#1e1e1e] border border-[#333] text-[10px] text-[#FF5D73] font-semibold rounded-lg hover:bg-[#FF5D73] hover:text-white transition-all"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#555]">
                No lessons uploaded yet. Add PDFs in Lesson Builder!
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between border-b border-[#222] pb-3">
              <span className="flex items-center gap-2">
                <Award size={18} className="text-amber-400" /> Recent Assignments
              </span>
              <Link to="/assignment-builder" className="text-xs text-[#FF5D73] hover:underline flex items-center gap-1">
                Builder <ArrowRight size={12} />
              </Link>
            </h2>

            {stats.recentAssignments && stats.recentAssignments.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAssignments.map(asgn => (
                  <div key={asgn._id} className="p-3.5 bg-[#141414] border border-[#222] rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white truncate max-w-[200px]">{asgn.title}</div>
                      <div className="text-[10px] text-[#7C7A7A] mt-0.5">
                        {asgn.type} • {asgn.totalMarks || 50} Marks
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FF5D73]/10 text-[#FF5D73]">
                      {asgn.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#555]">
                No assignments saved yet. Create one in Assignment Builder!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
