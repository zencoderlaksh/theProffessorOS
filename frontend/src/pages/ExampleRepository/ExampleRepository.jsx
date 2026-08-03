import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Sparkles, Plus, Save, CheckCircle, Copy, Check, 
  Trash2, Folder, Tag, X, BookOpen, Layers, Lightbulb, Code, ExternalLink, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ExampleRepository() {
  const [activeTab, setActiveTab] = useState('vault'); // 'vault' | 'ai-generator' | 'create'
  
  // Data state
  const [examples, setExamples] = useState([]);
  const [courses, setCourses] = useState([]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // AI Generator state
  const [aiTopicPrompt, setAiTopicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExamples, setGeneratedExamples] = useState([]);
  const [savedAiIndex, setSavedAiIndex] = useState(null);

  // Manual Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    courseId: '',
    category: 'Analogy',
    relatedTopics: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // View modal state
  const [viewingExample, setViewingExample] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchExamples();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchExamples = async () => {
    try {
      const params = {};
      if (selectedCourseFilter) params.courseId = selectedCourseFilter;
      if (selectedCategoryFilter !== 'All') params.category = selectedCategoryFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await axios.get('http://localhost:5000/api/examples', { params });
      setExamples(res.data);
    } catch (err) {
      console.error('Error fetching examples:', err);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, [searchQuery, selectedCourseFilter, selectedCategoryFilter]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!formData.relatedTopics.includes(currentTag.trim())) {
        setFormData(prev => ({
          ...prev,
          relatedTopics: [...prev.relatedTopics, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      relatedTopics: prev.relatedTopics.filter(t => t !== tagToRemove)
    }));
  };

  const handleSaveManual = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSaving(true);
    try {
      await axios.post('http://localhost:5000/api/examples', formData);
      setSaveSuccess(true);
      setFormData({ title: '', description: '', content: '', courseId: '', category: 'Analogy', relatedTopics: [] });
      await fetchExamples();
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveTab('vault');
      }, 1500);
    } catch (err) {
      console.error('Error saving example:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopicPrompt.trim()) return;
    setIsGenerating(true);
    setGeneratedExamples([]);

    try {
      const res = await axios.post('http://localhost:5000/api/examples/generate', {
        topic: aiTopicPrompt
      });
      setGeneratedExamples(res.data.examples || []);
    } catch (err) {
      console.error('AI generation failed:', err);
      alert(err.response?.data?.error || 'Failed to generate AI analogies.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAIExample = async (exampleItem, index) => {
    try {
      await axios.post('http://localhost:5000/api/examples', {
        title: exampleItem.title,
        description: exampleItem.description,
        content: exampleItem.content,
        category: exampleItem.category || 'Analogy',
        relatedTopics: exampleItem.relatedTopics || []
      });
      setSavedAiIndex(index);
      await fetchExamples();
      setTimeout(() => setSavedAiIndex(null), 2500);
    } catch (err) {
      console.error('Error saving AI example:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this knowledge item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/examples/${id}`);
      fetchExamples();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const copyContent = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto text-white">
      {/* Header & Tab Switcher */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Database className="text-[#FF5D73]" size={36} />
            Knowledge Base Vault
          </h1>
          <p className="text-[#7C7A7A] text-sm mt-1">
            Store, search, and generate reusable analogies & real-world examples across all courses
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#0a0a0a] p-1.5 rounded-2xl border border-[#222]">
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'vault'
                ? 'bg-[#FF5D73] text-white shadow-lg shadow-[#FF5D73]/20'
                : 'text-[#7C7A7A] hover:text-white'
            }`}
          >
            <BookOpen size={15} /> Vault ({examples.length})
          </button>

          <button
            onClick={() => setActiveTab('ai-generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ai-generator'
                ? 'bg-[#FF5D73] text-white shadow-lg shadow-[#FF5D73]/20'
                : 'text-[#7C7A7A] hover:text-white'
            }`}
          >
            <Sparkles size={15} /> AI Analogy Generator
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-[#FF5D73] text-white shadow-lg shadow-[#FF5D73]/20'
                : 'text-[#7C7A7A] hover:text-white'
            }`}
          >
            <Plus size={15} /> Create Example
          </button>
        </div>
      </header>

      {/* TAB 1: KNOWLEDGE VAULT LIBRARY */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          {/* Search & Filter Control Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-[#222] bg-[#0a0a0a]/80 flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[240px] flex items-center bg-[#141414] border border-[#333] rounded-xl px-3 py-2">
              <Search size={18} className="text-[#7C7A7A] mr-2" />
              <input
                type="text"
                placeholder="Search analogies, topics, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-[#555] focus:outline-none text-xs"
              />
            </div>

            {/* Course Filter */}
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-[#141414] border border-[#333] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#FF5D73]"
            >
              <option value="">All Courses</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            {/* Category Filter */}
            <div className="flex gap-1.5">
              {['All', 'Analogy', 'Code Snippet', 'Case Study'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#FF5D73]/10 text-[#FF5D73] border-[#FF5D73]/30'
                      : 'bg-[#141414] text-[#7C7A7A] border-[#222] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Examples Grid */}
          {examples.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-[#222] text-[#7C7A7A]">
              <Database size={44} className="mx-auto mb-3 opacity-30 text-[#FF5D73]" />
              <h3 className="text-lg font-semibold text-white mb-1">No Knowledge Items Found</h3>
              <p className="text-xs">Try clearing your filters or generate new analogies using the AI Generator.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examples.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel p-6 rounded-2xl border border-[#222] bg-[#0a0a0a]/80 flex flex-col justify-between hover:border-[#FF5D73]/30 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">
                        {item.category || 'Analogy'}
                      </span>
                      {item.courseId && (
                        <span className="text-[11px] font-medium text-[#7C7A7A] flex items-center gap-1">
                          <Folder size={12} className="text-[#FF5D73]" /> {item.courseId.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF5D73] transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-[#A0A0A0] line-clamp-2 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {item.relatedTopics && item.relatedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {item.relatedTopics.map(tag => (
                          <span key={tag} className="text-[10px] bg-[#161616] text-[#7C7A7A] px-2 py-0.5 rounded border border-[#222]">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1e1e1e]">
                    <button
                      onClick={() => setViewingExample(item)}
                      className="text-xs font-medium text-white hover:text-[#FF5D73] flex items-center gap-1.5 transition-colors"
                    >
                      <Eye size={14} /> View Content
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyContent(item._id, item.content)}
                        className="p-1.5 rounded-lg bg-[#141414] border border-[#222] text-[#7C7A7A] hover:text-white transition-colors"
                        title="Copy Markdown"
                      >
                        {copiedId === item._id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 rounded-lg bg-[#141414] border border-[#222] text-[#7C7A7A] hover:text-red-400 transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI ANALOGY GENERATOR */}
      {activeTab === 'ai-generator' && (
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-[#222] bg-[#0a0a0a]/90">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="text-[#FF5D73]" size={22} />
              Generate Creative Analogies & Teaching Examples
            </h2>
            <p className="text-xs text-[#7C7A7A] mb-6">
              Enter any technical topic or concept. AI will generate 3 real-world analogies, code demos, or scenarios ready to add to your vault.
            </p>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. Garbage Collection, Asynchronous Event Loop, Recursion, JWT Tokens..."
                value={aiTopicPrompt}
                onChange={(e) => setAiTopicPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
                className="flex-1 bg-[#141414] border border-[#333] rounded-2xl px-5 py-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
              />

              <button
                onClick={handleGenerateAI}
                disabled={isGenerating || !aiTopicPrompt.trim()}
                className="px-8 py-4 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-sm rounded-2xl transition-all shadow-lg shadow-[#FF5D73]/20 flex items-center gap-2 disabled:opacity-40"
              >
                {isGenerating ? 'Synthesizing...' : '✨ Generate Analogies'}
              </button>
            </div>
          </div>

          {/* Generated Cards */}
          {generatedExamples.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generatedExamples.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border border-[#222] bg-[#0a0a0a] flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20 inline-block mb-3">
                      {item.category || 'Analogy'}
                    </span>

                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed">{item.description}</p>
                    
                    <div className="p-4 bg-[#141414] rounded-xl border border-[#222] text-xs text-[#CCCCCC] leading-relaxed max-h-48 overflow-y-auto mb-4 custom-scrollbar">
                      {item.content}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSaveAIExample(item, idx)}
                    className="w-full py-2.5 bg-[#1a1a1a] hover:bg-[#FF5D73] border border-[#333] text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {savedAiIndex === idx ? (
                      <>
                        <CheckCircle size={15} className="text-emerald-400" /> Saved to Vault!
                      </>
                    ) : (
                      <>
                        <Plus size={15} /> Save to Knowledge Vault
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CREATE MANUAL EXAMPLE */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-8 rounded-3xl border border-[#222] bg-[#0a0a0a]/90 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 border-b border-[#222] pb-4 flex items-center gap-2">
              <Plus className="text-[#FF5D73]" size={22} />
              Add Knowledge Base Example
            </h2>

            {saveSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle size={18} /> Knowledge item saved to Vault successfully!
              </div>
            )}

            <form onSubmit={handleSaveManual} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Real-world Analogy: ATM Machine for OOP Encapsulation"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Course Link (Optional)</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleInputChange('courseId', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
                  >
                    <option value="">General (No specific course)</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5D73]"
                  >
                    <option value="Analogy">Analogy</option>
                    <option value="Code Snippet">Code Snippet</option>
                    <option value="Case Study">Case Study</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  placeholder="Short overview of why/how to teach this..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Tags / Topics</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.relatedTopics.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#FF5D73]/15 text-[#FF5D73] border border-[#FF5D73]/30 rounded-lg text-xs font-medium">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type tag and press Enter (e.g. Java, DataStructures)..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A0A0A0] mb-2 uppercase tracking-wider">Detailed Content (Markdown) *</label>
                <textarea
                  rows={8}
                  placeholder="Write full explanation, code snippets, or teaching scenario here..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full bg-[#141414] border border-[#333] rounded-xl p-4 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#FF5D73] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#FF5D73] to-[#e04359] hover:opacity-90 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-[#FF5D73]/20 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Save size={18} /> Save to Knowledge Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingExample && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border border-[#222] bg-[#0a0a0a] max-w-2xl w-full max-h-[80vh] flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/20">
                  {viewingExample.category || 'Analogy'}
                </span>
                <button onClick={() => setViewingExample(null)} className="text-[#7C7A7A] hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{viewingExample.title}</h2>
              {viewingExample.description && (
                <p className="text-xs text-[#A0A0A0] mb-4">{viewingExample.description}</p>
              )}

              <div className="p-4 bg-[#141414] rounded-2xl border border-[#222] text-xs text-[#E0E0E0] whitespace-pre-wrap max-h-80 overflow-y-auto custom-scrollbar leading-relaxed font-mono">
                {viewingExample.content}
              </div>
            </div>

            <div className="pt-6 border-t border-[#222] flex justify-end gap-3">
              <button
                onClick={() => copyContent(viewingExample._id, viewingExample.content)}
                className="px-4 py-2 bg-[#FF5D73] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Copy size={14} /> Copy Content
              </button>
              <button
                onClick={() => setViewingExample(null)}
                className="px-4 py-2 bg-[#1e1e1e] text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
