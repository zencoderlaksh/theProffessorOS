import { useState } from 'react';
import { Save, CheckCircle, Lightbulb, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalogyRepository() {
  const [formData, setFormData] = useState({
    concept: '',
    analogy: '',
    description: '',
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
      const response = await fetch('http://localhost:5000/api/analogies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ concept: '', analogy: '', description: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving analogy:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <Lightbulb size={36} className="text-yellow-400" />
            Analogy Repository
          </h1>
          <p className="text-slate-400">Store analogies separately for reuse</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-yellow-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Analogy'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-slate-700/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">
          
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Concept</label>
              <input
                type="text"
                value={formData.concept}
                onChange={(e) => handleInputChange('concept', e.target.value)}
                placeholder="e.g. React State"
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-all font-semibold"
              />
            </div>
            <span className="text-2xl text-slate-500 mt-6">&rarr;</span>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Analogy</label>
              <input
                type="text"
                value={formData.analogy}
                onChange={(e) => handleInputChange('analogy', e.target.value)}
                placeholder="e.g. Whiteboard"
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-all font-semibold text-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Explain how the analogy relates to the concept..."
              className="w-full min-h-[120px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-yellow-500 transition-all resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics / Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-yellow-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-yellow-500 transition-all px-3">
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
