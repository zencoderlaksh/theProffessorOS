import { useState } from 'react';
import { Save, CheckCircle, BookOpen, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResourceLibrary() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Book',
    url: '',
    relatedTopics: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [saved, setSaved] = useState(false);

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

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ title: '', type: 'Book', url: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving resource:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <BookOpen size={36} className="text-pink-500" />
            Resource Library
          </h1>
          <p className="text-slate-400">Reference books, papers, and docs. No local downloads.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-pink-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Resource'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-slate-700/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">
          
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Resource Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Clean Code by Robert C. Martin"
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-pink-500 transition-all"
              >
                <option value="Book">Book</option>
                <option value="PDF">PDF</option>
                <option value="Research Paper">Research Paper</option>
                <option value="Official Docs">Official Docs</option>
                <option value="Article">Article</option>
                <option value="Video">Video</option>
                <option value="GitHub">GitHub</option>
                <option value="Blog">Blog</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">External URL / Link</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://..."
              className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-pink-500 transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-pink-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-pink-500 transition-all px-3">
              <Tag size={18} className="text-slate-400" />
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Type tag and press Enter"
                className="w-full p-3 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
