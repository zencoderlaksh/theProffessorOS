import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Video, Plus, Trash2, ExternalLink, Calendar, 
  Sparkles, Filter, X, CheckCircle, RefreshCw, Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

function YoutubeIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function PersonalGrowth() {
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add Channel Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [newChannelCategory, setNewChannelCategory] = useState('Tech & Code');
  const [isAdding, setIsAdding] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchGrowthFeed();
  }, []);

  const fetchGrowthFeed = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/growth/feed');
      setChannels(res.data.channels || []);
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error('Error fetching growth feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim() || !newChannelUrl.trim()) return;

    setIsAdding(true);
    setErrorMessage('');

    try {
      await axios.post('http://localhost:5000/api/growth/channels', {
        name: newChannelName.trim(),
        inputUrl: newChannelUrl.trim(),
        category: newChannelCategory
      });

      setNewChannelName('');
      setNewChannelUrl('');
      setIsModalOpen(false);
      await fetchGrowthFeed();
    } catch (err) {
      console.error('Error adding channel:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to add channel.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteChannel = async (id) => {
    if (!window.confirm('Remove this channel from your feed?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/growth/channels/${id}`);
      fetchGrowthFeed();
    } catch (err) {
      console.error('Error deleting channel:', err);
    }
  };

  const filteredVideos = videos.filter(video => {
    if (selectedCategory === 'All') return true;
    return video.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categories = ['All', ...new Set(channels.map(c => c.category).filter(Boolean))];

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto text-white">
      {/* Header Bar */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <TrendingUp className="text-[#FF5D73]" size={36} />
            Personal Growth Feed
          </h1>
          <p className="text-[#7C7A7A] text-sm mt-1">
            Curated YouTube videos & latest tech releases from your favorite channels for continuous learning
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchGrowthFeed}
            className="p-3 bg-[#141414] hover:bg-[#1e1e1e] border border-[#333] rounded-xl text-white transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-xs rounded-xl transition-all shadow-lg shadow-[#FF5D73]/20 flex items-center gap-2"
          >
            <Plus size={16} /> Add YouTube Channel
          </button>
        </div>
      </header>

      {/* Subscribed Channels Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 mb-8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7C7A7A] flex items-center gap-2">
            <YoutubeIcon size={16} className="text-red-500" /> Subscribed Channels ({channels.length})
          </span>
          <span className="text-[11px] text-[#555]">Updates in real-time</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {channels.map((ch) => (
            <span
              key={ch._id}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#141414] border border-[#222] text-xs font-medium text-[#E0E0E0] group"
            >
              <span>{ch.name}</span>
              <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-[#7C7A7A]">
                {ch.category}
              </span>
              <button
                onClick={() => handleDeleteChannel(ch._id)}
                className="text-[#555] hover:text-red-400 transition-colors ml-1"
                title="Remove Channel"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
        <Filter size={15} className="text-[#7C7A7A] mr-1 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-[#FF5D73] text-white border-[#FF5D73] shadow-md shadow-[#FF5D73]/20'
                : 'bg-[#0a0a0a] text-[#7C7A7A] border-[#222] hover:text-white hover:bg-[#141414]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="glass-panel p-4 rounded-3xl border border-[#222] bg-[#0a0a0a] animate-pulse space-y-4">
              <div className="w-full h-44 bg-[#1e1e1e] rounded-2xl" />
              <div className="h-4 bg-[#1e1e1e] rounded w-3/4" />
              <div className="h-3 bg-[#1e1e1e] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-3xl border border-[#222] text-[#7C7A7A]">
          <YoutubeIcon size={48} className="mx-auto mb-3 opacity-30 text-red-500" />
          <h3 className="text-lg font-semibold text-white mb-1">No Videos Available</h3>
          <p className="text-xs">Add YouTube channels to populate your growth feed.</p>
        </div>
      ) : (
        /* Video Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, idx) => (
            <motion.div
              key={video.id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-panel p-4 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 flex flex-col justify-between hover:border-[#FF5D73]/40 transition-all group"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video bg-[#141414] border border-[#222]">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#555]">
                      <YoutubeIcon size={40} />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-[#FF5D73] text-white rounded-full shadow-lg scale-95 group-hover:scale-100 transition-transform"
                    >
                      <Play size={22} className="ml-0.5 fill-current" />
                    </a>
                  </div>
                </div>

                {/* Channel & Date Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold text-[#FF5D73] truncate">
                    {video.channelName}
                  </span>
                  <span className="text-[10px] text-[#555] font-mono shrink-0 flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(video.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Video Title */}
                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#FF5D73] transition-colors mb-3">
                  {video.title}
                </h3>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#1e1e1e] flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#161616] text-[#7C7A7A] border border-[#222]">
                  {video.category || 'Growth'}
                </span>

                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#FF5D73] font-semibold hover:underline"
                >
                  Watch Video <ExternalLink size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ADD CHANNEL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border border-[#222] bg-[#0a0a0a] max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                <YoutubeIcon className="text-red-500" size={24} />
                Add YouTube Channel
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7C7A7A] hover:text-white">
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleAddChannel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase">Channel Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Fireship, Lex Fridman, Veritasium..."
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase">YouTube Handle / Channel ID / URL *</label>
                <input
                  type="text"
                  placeholder="e.g. @Fireship or UC29ju8bIPH5as8OGnQzwJyA"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase">Category Tag</label>
                <select
                  value={newChannelCategory}
                  onChange={(e) => setNewChannelCategory(e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
                >
                  <option value="Tech & Code">Tech & Code</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="AI & ML">AI & ML</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Science & Math">Science & Math</option>
                  <option value="Career & Business">Career & Business</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-[#1e1e1e] text-[#A0A0A0] hover:text-white rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding || !newChannelName.trim() || !newChannelUrl.trim()}
                  className="px-5 py-2.5 bg-[#FF5D73] hover:bg-[#ff405b] text-white rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-40"
                >
                  <Plus size={15} /> Add Channel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
