import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Pin, Edit3, PlayCircle, PlusCircle, Code, Database, BookOpen, FileText, Calendar, CloudLightning } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    totalTopics: 0,
    totalNotes: 0,
    totalExamples: 0,
    totalCodeSnippets: 0,
    totalAssignments: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [aiAnswer, setAiAnswer] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);

    if (q.trim().length > 2) {
      // Trigger Semantic Search dynamically
      setIsSearching(true);
      try {
        const res = await fetch('http://localhost:5000/api/search/semantic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q })
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        }
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
        const res = await fetch('http://localhost:5000/api/search/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery })
        });
        if (res.ok) {
          const data = await res.json();
          setAiAnswer(data.answer);
          setSearchResults(data.sources || []);
        }
      } catch (err) {
        console.error('Ask AI error', err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleBackup = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/backup/export');
      if (res.ok) {
        alert("Backup generated successfully! (Mocked download)");
      }
    } catch (err) {
      console.error('Backup error', err);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <motion.h1 
          className={`${styles.title} text-gradient`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          ProfessorOS
        </motion.h1>
        
        <div className="flex gap-4 items-center flex-1 max-w-2xl mx-8 relative">
          <motion.div 
            className="w-full relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center bg-[#0a0a0a] border border-[#494949] rounded-full px-6 py-4 focus-within:border-[#FF5D73] transition-all shadow-lg w-full">
              <Search size={24} className="text-[#7C7A7A] mr-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                onKeyDown={handleAskAI}
                placeholder="Ask AI: 'Explain recursion with a real-world example' (Press Enter)"
                className="bg-transparent border-none outline-none text-[#FFFFFF] w-full placeholder-[#7C7A7A] text-base"
              />
            </div>
            {(isSearching || aiAnswer || searchResults.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#494949] rounded-xl shadow-2xl z-50 max-h-[32rem] overflow-y-auto">
                {isSearching ? (
                  <div className="p-6 text-base text-[#7C7A7A] text-center flex justify-center items-center gap-3">
                    <CloudLightning className="animate-pulse text-[#FF5D73]" /> Thinking...
                  </div>
                ) : (
                  <div className="p-6">
                    {aiAnswer && (
                      <div className="mb-6 pb-6 border-b border-[#494949]">
                        <h3 className="text-sm font-semibold text-[#FF5D73] uppercase tracking-wider mb-3">AI Response</h3>
                        <p className="text-[#FFFFFF] text-base leading-relaxed whitespace-pre-wrap">{aiAnswer}</p>
                      </div>
                    )}
                    
                    {searchResults.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-[#7C7A7A] uppercase tracking-wider mb-3">Retrieved from Knowledge Base</h3>
                        <div className="space-y-3">
                          {searchResults.map((result, idx) => (
                            <div key={idx} className="p-4 border border-[#494949] rounded-lg bg-[#141414] hover:border-[#FF5D73] transition-colors">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-[#0a0a0a] text-[#FF5D73] border border-[#FF5D73]/30">{result.type}</span>
                                <span className="text-base text-[#FFFFFF] font-medium">{result.title}</span>
                              </div>
                              <p className="text-sm text-[#7C7A7A] line-clamp-2">{result.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleBackup} className="px-5 py-3 bg-[#141414] hover:bg-[#494949] text-[#FFFFFF] text-base rounded-xl border border-[#494949] transition-colors flex items-center gap-2">
            <CloudLightning size={20} /> Backup System
          </button>
          <Link to="/lesson-builder" className="flex items-center gap-2 px-6 py-3 bg-[#FF5D73] hover:bg-[#ff405b] text-white rounded-xl font-medium transition-colors shadow-lg shadow-[#FF5D73]/20">
            <PlusCircle size={22} /> Lesson Builder
          </Link>
        </div>
      </header>

      <motion.div 
        className={styles.statsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Total Subjects', value: stats.totalSubjects },
          { label: 'Total Topics', value: stats.totalTopics },
          { label: 'Total Notes', value: stats.totalNotes },
          { label: 'Total Examples', value: stats.totalExamples },
          { label: 'Code Snippets', value: stats.totalCodeSnippets },
          { label: 'Assignments', value: stats.totalAssignments },
        ].map((stat, idx) => (
          <motion.div key={idx} className={`${styles.statCard} glass-panel`} variants={itemVariants}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.section 
        className="my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-8 flex items-center gap-3">
          <Database size={24} className="text-[#FF5D73]" />
          Knowledge Hub Builders
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <Link to="/example-repository" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <Database size={28} className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 transition-colors" />
            <span className="text-sm font-medium text-[#FFFFFF]">Examples</span>
          </Link>
          <Link to="/code-playground" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <Code size={28} className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 transition-colors" />
            <span className="text-sm font-medium text-[#FFFFFF]">Playground</span>
          </Link>
          <Link to="/analogy-repository" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <span className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 text-3xl transition-colors">💡</span>
            <span className="text-sm font-medium text-[#FFFFFF]">Analogies</span>
          </Link>
          <Link to="/diagram-repository" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <span className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 text-3xl transition-colors">🖼️</span>
            <span className="text-sm font-medium text-[#FFFFFF]">Diagrams</span>
          </Link>
          <Link to="/assignment-builder" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <span className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 text-3xl transition-colors">📝</span>
            <span className="text-sm font-medium text-[#FFFFFF]">Assignments</span>
          </Link>
          <Link to="/question-bank" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <span className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 text-3xl transition-colors">❓</span>
            <span className="text-sm font-medium text-[#FFFFFF]">Questions</span>
          </Link>
          <Link to="/project-repository" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <span className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 text-3xl transition-colors">💼</span>
            <span className="text-sm font-medium text-[#FFFFFF]">Projects</span>
          </Link>
          <Link to="/resource-library" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <BookOpen size={28} className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 transition-colors" />
            <span className="text-sm font-medium text-[#FFFFFF]">Resources</span>
          </Link>
          <Link to="/teaching-notes" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <FileText size={28} className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 transition-colors" />
            <span className="text-sm font-medium text-[#FFFFFF]">Private Notes</span>
          </Link>
          <Link to="/lecture-planner" className="flex flex-col items-center p-6 bg-[#0a0a0a] hover:bg-[#141414] border border-[#494949] hover:border-[#FF5D73] rounded-xl transition-all text-center group">
            <Calendar size={28} className="text-[#7C7A7A] group-hover:text-[#FF5D73] mb-3 transition-colors" />
            <span className="text-sm font-medium text-[#FFFFFF]">Lecture Plan</span>
          </Link>
        </div>
      </motion.section>

      <div className={styles.sectionsGrid}>
        <motion.section 
          className={`${styles.section} glass-panel`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>
            <Clock size={22} className="text-gradient" />
            Recent Activity
          </h2>
          <div className="flex flex-col gap-3 mt-4">
            <ul className="space-y-4">
              <li className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#494949] cursor-pointer hover:border-[#FF5D73] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-[#141414] text-[#FFFFFF] border border-[#494949]">Edited</span>
                  <span className="text-[#FFFFFF] text-base font-medium">React Component Lifecycle</span>
                </div>
                <span className="text-[#7C7A7A] text-sm">2 mins ago</span>
              </li>
              <li className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-[#494949] cursor-pointer hover:border-[#FF5D73] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/30">Added</span>
                  <span className="text-[#FFFFFF] text-base font-medium">Library Management Example</span>
                </div>
                <span className="text-[#7C7A7A] text-sm">1 hour ago</span>
              </li>
            </ul>
          </div>
        </motion.section>

        <motion.section 
          className={`${styles.section} glass-panel`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.sectionHeader}>
            <h2 className="text-xl font-semibold text-[#FFFFFF] flex items-center gap-2">
              <Pin size={22} className="text-[#FF5D73]" />
              Pinned Items
            </h2>
          </div>
          <div className={styles.sectionContent}>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#494949] cursor-pointer hover:border-[#FF5D73] transition-colors">
                <span className="text-[#FF5D73] text-xl">💡</span>
                <span className="text-[#FFFFFF] text-base font-medium">React State (Whiteboard)</span>
              </li>
              <li className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#494949] cursor-pointer hover:border-[#FF5D73] transition-colors">
                <span className="text-[#FF5D73] text-xl">📝</span>
                <span className="text-[#FFFFFF] text-base font-medium">Build a Todo App</span>
              </li>
              <li className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#494949] cursor-pointer hover:border-[#FF5D73] transition-colors">
                <span className="text-[#FF5D73] text-xl">🗄️</span>
                <span className="text-[#FFFFFF] text-base font-medium">ATM Example</span>
              </li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
