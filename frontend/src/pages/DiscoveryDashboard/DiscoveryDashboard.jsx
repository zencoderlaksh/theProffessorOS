import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Cpu, Newspaper, Bookmark, Search, RefreshCw, 
  ExternalLink, Calendar, Filter, Globe, Wrench, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiscoveryDashboard() {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    fetchDashboard();
    fetchBookmarks();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/discovery/dashboard');
      const newsItems = res.data.news || [];
      setNews(newsItems);

      const bSet = new Set();
      newsItems.forEach(item => {
        if (item.isBookmarked) bSet.add(item._id);
      });
      setBookmarkedIds(bSet);
    } catch (error) {
      console.error('Error fetching radar data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/discovery/bookmarks');
      const bookmarkedNews = res.data.news || [];
      const bSet = new Set(bookmarkedNews.map(item => item._id));
      setBookmarkedIds(bSet);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDashboard();
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/discovery/search?query=${searchQuery}`);
      setNews(res.data.news || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async (id) => {
    try {
      await axios.put('http://localhost:5000/api/discovery/bookmark', { id, type: 'news' });
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      fetchBookmarks();
    } catch (error) {
      console.error(error);
    }
  };

  const triggerManualSync = async () => {
    setIsSyncing(true);
    try {
      await axios.post('http://localhost:5000/api/discovery/fetch');
      await fetchDashboard();
      await fetchBookmarks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredItems = news.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Bookmarks') return bookmarkedIds.has(item._id);
    return item.category?.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto text-white">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Globe className="text-[#FF5D73]" size={36} />
            AI & Tech Radar
          </h1>
          <p className="text-[#7C7A7A] text-sm mt-1">
            Pure internet news stream: AI breakthroughs, new market tools, and major tech article releases
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-3 text-[#555]" size={16} />
            <input
              type="text"
              placeholder="Search AI tools, GPT-5, Claude 3.5..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#0a0a0a] border border-[#222] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
            />
          </div>

          <button
            onClick={triggerManualSync}
            disabled={isSyncing}
            className="px-4 py-2.5 bg-[#141414] hover:bg-[#1e1e1e] border border-[#333] rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Scanning Web...' : 'Scan Web Radar'}
          </button>
        </div>
      </header>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        <Filter size={15} className="text-[#7C7A7A] mr-1 shrink-0" />
        {[
          { label: '🌐 All Internet News', value: 'All' },
          { label: '🤖 AI Breakthroughs', value: 'AI' },
          { label: '🛠️ New Market Tools', value: 'Market' },
          { label: '💻 Dev & Frameworks', value: 'Dev' },
          { label: '🔖 Saved Articles', value: 'Bookmarks' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeCategory === tab.value
                ? 'bg-[#FF5D73] text-white border-[#FF5D73] shadow-md shadow-[#FF5D73]/20'
                : 'bg-[#0a0a0a] text-[#7C7A7A] border-[#222] hover:text-white hover:bg-[#141414]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Stream */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a] animate-pulse space-y-4">
              <div className="h-4 bg-[#1e1e1e] rounded w-1/3" />
              <div className="h-6 bg-[#1e1e1e] rounded w-3/4" />
              <div className="h-12 bg-[#1e1e1e] rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-[#222] text-[#7C7A7A]">
          <Globe size={48} className="mx-auto mb-3 opacity-30 text-[#FF5D73]" />
          <h3 className="text-lg font-semibold text-white mb-1">No Internet News Found</h3>
          <p className="text-xs">Click <strong>Scan Web Radar</strong> above to scan VentureBeat, MIT Tech Review, TechCrunch, and Dev.to.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isBookmarked = bookmarkedIds.has(item._id);

            return (
              <motion.div
                key={item._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-panel p-6 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/30 transition-all group"
              >
                <div>
                  {/* Top Badge Bar */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">
                      {item.category || 'Internet News'}
                    </span>
                    <span className="text-[10px] text-[#555] font-mono flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-[#FF5D73] transition-colors mb-2">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>

                  {/* Source */}
                  <p className="text-[11px] font-semibold text-[#7C7A7A] mb-3">
                    Source: <span className="text-white">{item.source || 'Internet Publication'}</span>
                  </p>

                  {/* Description Preview */}
                  {item.description && (
                    <p className="text-xs text-[#A0A0A0] line-clamp-3 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-[#1e1e1e] flex items-center justify-between">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#FF5D73] font-semibold hover:underline"
                  >
                    Read Article <ExternalLink size={13} />
                  </a>

                  <button
                    onClick={() => toggleBookmark(item._id)}
                    className={`p-2 rounded-xl border transition-all ${
                      isBookmarked
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-[#141414] text-[#555] border-[#222] hover:text-white'
                    }`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Save Article'}
                  >
                    <Bookmark size={15} className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
