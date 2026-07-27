import { useState } from 'react';
import { Save, CheckCircle, FileText, Lock, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeachingNotes() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPrivate: true,
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
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ title: '', content: '', isPrivate: true, relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <FileText size={36} className="text-amber-500" />
            Teaching Notes
          </h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Lock size={16} /> Private notes. Invisible to students.
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-amber-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Note'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-amber-900/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Note Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Common pitfalls with Arrays"
              className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all font-semibold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Private Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your personal teaching notes here (e.g. 'Students generally ask this', 'Explain with ATM example')..."
              className="w-full min-h-[300px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-amber-50 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-amber-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-amber-500 transition-all px-3">
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
