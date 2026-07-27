import { useState } from 'react';
import { Save, CheckCircle, Image as ImageIcon, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiagramRepository() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'PNG',
    contentUrl: '',
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
      const response = await fetch('http://localhost:5000/api/diagrams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSaved(true);
        setFormData({ title: '', type: 'PNG', contentUrl: '', relatedTopics: [] });
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error('Error saving diagram:', err);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight flex items-center gap-3">
            <ImageIcon size={36} className="text-purple-500" />
            Diagram Repository
          </h1>
          <p className="text-slate-400">Store and link PNG, SVG, Draw.io, Mermaid, or Excalidraw</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/30"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? 'Saved!' : 'Save Diagram'}
        </button>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-xl border border-slate-700/50 bg-slate-900/40"
      >
        <div className="flex flex-col gap-6">
          
          <div className="flex gap-4">
            <div className="flex-[2]">
              <label className="block text-sm font-medium text-slate-300 mb-2">Diagram Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. React Component Lifecycle"
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all font-semibold"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full p-3 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 transition-all"
              >
                <option value="PNG">PNG Image</option>
                <option value="SVG">SVG File</option>
                <option value="Draw.io">Draw.io</option>
                <option value="Mermaid">Mermaid Flowchart</option>
                <option value="Excalidraw">Excalidraw</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {['Mermaid', 'SVG'].includes(formData.type) ? 'Raw Content' : 'Image/File URL'}
            </label>
            <textarea
              value={formData.contentUrl}
              onChange={(e) => handleInputChange('contentUrl', e.target.value)}
              placeholder={['Mermaid', 'SVG'].includes(formData.type) ? "Paste raw SVG or Mermaid syntax here..." : "https://example.com/diagram.png"}
              className="w-full min-h-[150px] p-4 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all font-mono text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Topics</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.relatedTopics.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-purple-200 transition-colors">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg focus-within:border-purple-500 transition-all px-3">
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
